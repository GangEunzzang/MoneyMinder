FROM openjdk:17-jdk-alpine

WORKDIR /app/moneyMinder

ARG JAR_PATH=build/libs
ARG RESOURCES_PATH=build/resources/main

COPY ${JAR_PATH}/*.jar /app/moneyMinder/moneyMinder.jar

ARG SPRING_PROFILES_ACTIVE=dev
ENV SPRING_PROFILES_ACTIVE=${SPRING_PROFILES_ACTIVE}

ENTRYPOINT ["java", "-jar", "moneyMinder.jar"]
