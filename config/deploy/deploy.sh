#!/bin/bash

LOG_FILE="/home/ec2-user/moneyminder/log/deploy.log"
DOCKER_COMPOSE_FILE="docker-compose-deploy.yml"

# 로그 파일이 없으면 생성
if [ ! -f "$LOG_FILE" ]; then
  mkdir -p $(dirname "$LOG_FILE")
  touch "$LOG_FILE"
fi

# 로그 출력 함수
log() {
  echo -e "$1" >> $LOG_FILE
}

# 공통 Docker Compose 명령 함수
docker_compose_cmd() {
  local action=$1  # pull, up 등
  local service=$2  # nginx, moneyMinder-backend-blue 등
  docker-compose -f ${DOCKER_COMPOSE_FILE} $action $service
}

# Health Check
health_check() {
  local container_name=$1
  local port=$2

  for i in {1..10}; do
    response=$(curl -s http://localhost:${port}/actuator/health)
    success=$(echo $response | jq '.status' | grep 'UP')

    if [[ -n $success ]]; then
      log "   - Health Check 성공\n"
      return 0  # 성공 시 0 반환 (정상)
    else
      log "  - Health Check 실패.. Response: ${response}"
    fi

    if [[ $i -eq 10 ]]; then
      log "-----------------------------------------------"
      log "Health Check 실패"
      log "Nginx에 연결하지 않고 배포를 종료합니다."
      log "컨테이너를 종료합니다."
      log "-----------------------------------------------"
      docker stop ${container_name}
      exit 1
    fi

    log "  - 10초 후 재시도합니다.\n"
    sleep 10
  done
}

# nginx.conf 변경
change_nginx_config() {
  local target=$1  # Blue 또는 Green으로 배포할 대상

  NGINX_CONF="/home/ec2-user/moneyminder/config/deploy/nginx.conf"

  if [[ "$target" == "blue" ]]; then
    # proxy_pass를 backend_blue로 변경 (컨테이너 내부에서 명령 실행)
    docker exec nginx sed -i 's#http://green#http://blue#g' $NGINX_CONF
    log "Nginx 설정이 Blue로 변경되었습니다.\n"
  else
    # proxy_pass를 backend_green으로 변경 (컨테이너 내부에서 명령 실행)
    docker exec nginx sed -i 's#http://blue#http://green#g' $NGINX_CONF
    log "Nginx 설정이 Green으로 변경되었습니다.\n"
  fi

  # 컨테이너 내부에서 Nginx 설정 확인 및 재시작
  docker exec nginx nginx -t && docker exec nginx nginx -s reload

  if [[ $? -eq 0 ]]; then
    log "Nginx 설정이 성공적으로 적용되고 재시작되었습니다.\n"
  else
    log "Nginx 설정 적용 중 오류가 발생했습니다.\n"
    exit 1
  fi
}


# 빌드 시작
log "\n\n\n\n-----------------------------------------------"
log "배포 시작"
log "시작시간 : $(date +"%Y.%m.%d - %H:%M:%S")"
log "-----------------------------------------------"

# Green 컨테이너 실행 중인지 확인
IS_GREEN=$(docker ps | grep green)

DEFAULT_CONF="/etc/nginx/nginx.conf"
docker_compose_cmd "pull" "nginx"
docker_compose_cmd "up -d" "nginx"
log "Nginx 컨테이너 실행 완료 \n\n"

# Green 컨테이너가 실행 중일 경우 Blue로 배포
if [[ -n $IS_GREEN ]]; then
  log " Green 컨테이너가 실행 중입니다. Blue 컨테이너로 배포합니다.\n"

  log "1. 도커 컴포즈 pull 시작 \n"
  docker_compose_cmd "pull" "moneyMinder-backend-blue"

  log "2. 도커 컴포즈 up 시작 \n"
  docker_compose_cmd "up -d" "moneyMinder-backend-blue"

  log "3. Health Check 시작 \n"
  health_check "moneyMinder-backend-blue" "8080"

  log "4. Nginx 설정 변경 시작 \n"
  change_nginx_config "blue"

# Blue 컨테이너가 실행중이거나 둘 다 실행 중이 아닐 경우 Green으로 배포
else
  log " Blue 컨테이너가 실행 중이거나 둘 다 실행 중이 아닙니다. Green 컨테이너로 배포합니다.\n"

  log "1. 도커 이미지 빌드 시작 \n"
  docker_compose_cmd "pull" "moneyMinder-backend-green"

  log "2. 도커 컨테이너 실행 시작 \n"
  docker_compose_cmd "up -d" "moneyMinder-backend-green"

  log "3. Health Check 시작 "
  health_check "moneyMinder-backend-green" "8081"

  log "4. Nginx 설정 변경 시작 \n"
  change_nginx_config "green"
fi

log "-----------------------------------------------"
log "배포가 완료되었습니다."
log "종료시간 : $(date +"%Y.%m.%d - %H:%M:%S")"
log "-----------------------------------------------"