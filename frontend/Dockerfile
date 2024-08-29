# 1. Node.js 이미지 사용하여 애플리케이션 빌드
FROM node:latest as build-stage

WORKDIR /app/moneyMinder

COPY package*.json ./

RUN npm install

COPY . .

# Vue.js 애플리케이션 빌드
RUN npm run build

# 2. NGINX 이미지 사용하여 빌드된 파일을 서빙
FROM nginx:alpine as production-stage

# NGINX 설정 파일을 복사 (optional, 기본 설정을 사용할 경우 생략 가능)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 파일을 NGINX의 기본 HTML 폴더로 복사
COPY --from=build-stage /app/moneyMinder/dist /usr/share/nginx/html

# NGINX 포트 노출
EXPOSE 80

# NGINX 실행
CMD ["nginx", "-g", "daemon off;"]
