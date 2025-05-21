package com.moneyminder.presentation;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/webhook")
public class GitWebHookController {

    private static final String CONFIG_PREFIX = "config/";
    private static final String REFRESH_ENDPOINT = "/actuator/refresh";

    private final DiscoveryClient discoveryClient;
    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping
    public ResponseEntity<String> handleWebhook(@RequestBody WebhookPayload payload) {
        Set<String> affectedServices = extractServiceNamesFrom(payload);

        if (affectedServices.isEmpty()) {
            log.info("📭 변경된 서비스 없음 (스킵)");
            return ResponseEntity.ok("No services to refresh.");
        }

        affectedServices.forEach(this::refreshService);

        return ResponseEntity.ok("Webhook processed.");
    }

    private Set<String> extractServiceNamesFrom(WebhookPayload payload) {
        Set<String> serviceNames = new HashSet<>();

        if (payload.getCommits() == null) return serviceNames;

        for (Commit commit : payload.getCommits()) {
            if (commit.getModified() == null) continue;

            for (String path : commit.getModified()) {
                if (path != null && path.startsWith(CONFIG_PREFIX)) {
                    String[] parts = path.split("/");
                    if (parts.length >= 2) {
                        serviceNames.add(parts[1].trim());
                    }
                }
            }
        }

        return serviceNames;
    }

    private void refreshService(String serviceName) {
        List<ServiceInstance> instances = discoveryClient.getInstances(serviceName);

        if (instances.isEmpty()) {
            log.warn("❗ Eureka에서 '{}' 서비스 인스턴스를 찾을 수 없습니다.", serviceName);
            return;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>("", headers);

        for (ServiceInstance instance : instances) {
            String url = instance.getUri() + REFRESH_ENDPOINT;
            try {
                restTemplate.postForEntity(url, entity, String.class);
                log.info("✅ 설정 리프레시 완료 → [{}] @ [{}]", serviceName, url);
            } catch (Exception e) {
                log.error("❌ 설정 리프레시 실패 → [{}] @ [{}]: {}", serviceName, url, e.getMessage(), e);
            }
        }
    }

    @Data
    public static class WebhookPayload {
        private List<Commit> commits;
    }

    @Data
    public static class Commit {
        private List<String> modified;
    }
}
