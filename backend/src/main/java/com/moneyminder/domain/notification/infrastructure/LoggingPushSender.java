package com.moneyminder.domain.notification.infrastructure;

import com.moneyminder.domain.notification.application.PushSender;
import com.moneyminder.domain.notification.domain.DeviceToken;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * 아직 실제로 보내지 않는다. 무엇을 누구에게 보내려 했는지만 남긴다 —
 * FCM/APNs 자격증명이 붙기 전까지 이게 유일한 흔적이다.
 */
@Slf4j
@Component
public class LoggingPushSender implements PushSender {

    @Override
    public void send(List<DeviceToken> targets, String title, String body) {
        log.info("push (미발송) targets={} title={} body={}", targets.size(), title, body);
    }
}
