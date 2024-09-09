package com.moneyminder.global.config;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.StringUtils;
import redis.embedded.RedisServer;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;

@Slf4j
@Profile("!dev")
@Configuration
public class EmbeddedRedisConfig {

    @Value("${spring.data.redis.port}")
    private int redisPort;

    private RedisServer redisServer;

    @PostConstruct
    public void redisServer() throws IOException {
        int port = isRedisRunning() ? findAvailablePort() : redisPort;

        if (isArmArchitecture()) {
            redisServer = new RedisServer(getRedisServerExecutable(), port);
        } else {
            redisServer = RedisServer.builder()
                    .port(port)
                    .setting("maxmemory 128M")
                    .build();
        }

        redisServer.start();
    }


    // Arm 아키텍처가 맞는지 확인하는 메서드
    private boolean isArmArchitecture() {
        return System.getProperty("os.arch").contains("aarch64");
    }

    @PreDestroy
    public void stopRedis() {
        redisServer.stop();
    }

    public int findAvailablePort() throws IOException {
        for (int port = 10000; port <= 65535; port++) {
            Process process = executeGrepProcessCommand(port);
            if (!isRunning(process)) {
                return port;
            }
        }

        throw new RuntimeException();
    }

    /**
     * Embedded Redis가 현재 실행중인지 확인
     */
    private boolean isRedisRunning() throws IOException {
        return isRunning(executeGrepProcessCommand(redisPort));
    }

    /**
     * 해당 port를 사용중인 프로세스를 확인하는 sh 실행
     */
    private Process executeGrepProcessCommand(int port) throws IOException {
        String OS = System.getProperty("os.name").toLowerCase();
        if (OS.contains("win")) {
            log.info("OS is  " + OS + " " + port);
            String command = String.format("netstat -nao | find \"LISTEN\" | find \"%d\"", port);
            String[] shell = {"cmd.exe", "/y", "/c", command};

            return Runtime.getRuntime().exec(shell);
        }

        String command = String.format("netstat -nat | grep LISTEN|grep %d", port);
        String[] shell = {"/bin/sh", "-c", command};

        return Runtime.getRuntime().exec(shell);
    }

    /**
     * 해당 Process가 현재 실행중인지 확인
     */
    private boolean isRunning(Process process) {
        String line;
        StringBuilder pidInfo = new StringBuilder();

        try (BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            while ((line = input.readLine()) != null) {
                pidInfo.append(line);
            }
        } catch (Exception e) {
            throw new RuntimeException();
        }
        return StringUtils.hasText(pidInfo.toString());
    }

    private File getRedisServerExecutable() throws IOException {
        try {
            return new ClassPathResource("binary/redis/redis-server-linux-arm64-arc").getFile();
        } catch (Exception e) {
            throw new IOException("Redis Server Executable not found");
        }
    }
}
