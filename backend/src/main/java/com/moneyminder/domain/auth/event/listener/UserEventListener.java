package com.moneyminder.domain.auth.event.listener;

import com.moneyminder.domain.auth.event.domain.UserRegisterEvent;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class UserEventListener {

    private final JavaMailSender mailSender;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleUserRegisteredEvent(UserRegisterEvent event) throws MessagingException, IOException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(event.email());
        helper.setSubject("[MoneyMinder] " + event.name() + "님, 회원가입을 축하드립니다 ;");

        ClassLoader classLoader = getClass().getClassLoader();
        File file = new File(classLoader.getResource("static/join.html").getFile());

        helper.setText(new String(Files.readAllBytes(file.toPath())), true);
        mailSender.send(message);
    }

}
