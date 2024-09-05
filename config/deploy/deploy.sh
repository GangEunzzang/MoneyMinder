#!/bin/bash

# 현재 시간 출력
NOW_TIME=$(date +"%Y%m%d - %H:%M:%S")
LOG_FILE="/moneyminder/log/deploy.log"

# 로그 출력 함수
log() {
  echo -e "$1" >> $LOG_FILE
}



# 로그 파일 시작
log "\n\n\n\n=============== <빌드 시작> ==============="
log " 실행시간 : $NOW_TIME \n"

# Green 컨테이너 실행 중인지 확인
IS_GREEN=$(docker ps | grep green)

# Nginx 컨테이너 실행
DEFAULT_CONF="/etc/nginx/nginx.conf"
docker-compose up -d nginx
log " Nginx 컨테이너 실행 완료 \n\n"


# Green 컨테이너가 실행 중일 경우 Blue로 배포
if [[ -n $IS_GREEN ]]; then
  log " Green 컨테이너가 실행 중입니다. Blue 컨테이너로 배포합니다.\n"

  log "1. 도커 이미지 빌드 시작 \n"
  docker-compose pull moneyMinder-backend-blue

  log "2. 도커 컨테이너 실행 시작 \n"
  docker-compose up -d moneyMinder-backend-blue

  log "3. Health Check 시작 \n"
  health_check "moneyMinder-backend-blue" "8080"

  log "4. Nginx 설정 변경 시작 \n"
  sudo sed -i 's/proxy_pass http:\/\/green;/proxy_pass http:\/\/blue;/' $NGINX_CONF


# Blue 컨테이너가 실행중이거나 둘 다 실행 중이 아닐 경우 Green으로 배포
else
  log " Blue 컨테이너가 실행 중이거나 둘 다 실행 중이 아닙니다. Green 컨테이너로 배포합니다.\n"

  log "1. 도커 이미지 빌드 시작 \n"
  docker-compose pull moneyMinder-backend-green

  log "2. 도커 컨테이너 실행 시작 \n"
  docker-compose up -d moneyMinder-backend-green

  log "3. Health Check 시작 "
  health_check "moneyMinder-backend-green" "8081"
fi



# Health Check
health_check() {
  local container_name=$1
  local port=$2

  for i in {1..10}; do
    response=$(curl -s http://${container_name}:${port}/actuator/health)
    success=$(echo $response | jq '.status' | grep 'UP')

    if [[ -n $success ]]; then
      log "Health Check 성공\n"
      return 0  # 성공 시 0 반환 (정상)
    else
      log "Health Check의 응답이 없거나 status가 UP이 아닙니다.\n"
      log "Health Check Response: ${response}\n"
    fi

    if [[ $i -eq 10 ]]; then
      log "Health Check 실패\n"
      log "Nginx에 연결하지 않고 배포를 종료합니다.\n"
      log "컨테이너를 종료합니다.\n"
      log "종료시간 : $NOW_TIME \n"
      docker stop ${container_name}
      exit 1
    fi

    log "Health Check 실패... 10초 후 재시도합니다.\n"
    sleep 10
  done
}

# nginx.conf 변경
change_nginx_config() {
  local target=$1  # Blue 또는 Green으로 배포할 대상

  log "4. Nginx 설정 변경 시작\n"

  NGINX_CONF="/etc/nginx/nginx.conf"

  if [[ "$target" == "blue" ]]; then
    # proxy_pass를 backend_blue로 변경 (컨테이너 내부에서 명령 실행)
    docker exec nginx sed -i 's#http://green#http://blue#g' $NGINX_CONF
    log "Nginx 설정이 Blue로 변경되었습니다.\n"
  else
    # proxy_pass를 backend_green으로 변경 (컨테이너 내부에서 명령 실행)
    docker exec nginx sed -i 's#http://green#http://blue#g' $NGINX_CONF
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
