package com.moneyminder.domain.notification.application;

import com.moneyminder.domain.notification.domain.DeviceToken;
import java.util.List;

/**
 * 서버가 푸시를 보내는 통로. 지금은 알림을 앱이 직접 쏘므로 구현이 비어 있다
 * ([[DECISIONS#BD12]]). FCM/APNs 를 붙일 때 이 인터페이스만 채우면 되고,
 * 부르는 쪽과 앱은 그대로 둔다.
 */
public interface PushSender {

    void send(List<DeviceToken> targets, String title, String body);
}
