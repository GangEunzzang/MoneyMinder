package com.moneyminder.global.factory;

import static java.util.stream.Collectors.joining;

import com.moneyminder.global.util.TimeUtils;
import jakarta.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import net.gpedro.integrations.slack.SlackAttachment;
import net.gpedro.integrations.slack.SlackField;
import net.gpedro.integrations.slack.SlackMessage;
import org.springframework.stereotype.Component;

@Component
public class SlackMessageFactory {

    private static final String ERROR_TITLE = "에러가 발생했습니다 🚨";

    public SlackMessage generateErrorMessage(HttpServletRequest request, Exception exception) {
        return new SlackMessage()
                .setAttachments(generateAttachments(request, exception))
                .setText(ERROR_TITLE);
    }

    private List<SlackAttachment> generateAttachments(HttpServletRequest request, Exception exception) {
        return List.of(new SlackAttachment()
                .setFallback("Error")
                .setColor("danger")
                .setTitleLink(request.getContextPath())
                .setText(formatException(exception))
                .setColor("danger")
                .setFields(generateFields(request)));
    }

    private String formatException(Exception exception) {
        return String.format("📍 Exception Class%n%s%n📍 Exception Message%n%s%n%s",
                exception.getClass().getName(),
                exception.getMessage(),
                Arrays.toString(exception.getStackTrace()));
    }

    private List<SlackField> generateFields(HttpServletRequest request) {
        return List.of(
                new SlackField().setTitle("✅ Request Method").setValue(request.getMethod()),
                new SlackField().setTitle("✅ Request URL").setValue(request.getRequestURL().toString()),
                new SlackField().setTitle("✅ Request Time")
                        .setValue(TimeUtils.format(LocalDateTime.now(), "yyyy-MM-dd HH:mm:ss")),
                new SlackField().setTitle("✅ Request IP").setValue(request.getRemoteAddr()),
                new SlackField().setTitle("✅ Request Headers").setValue(request.toString()),
                new SlackField().setTitle("✅ Request Body").setValue(getRequestBody(request))
        );
    }

    private String getRequestBody(HttpServletRequest request) {
        String body = "";

        try (
                InputStream inputStream = request.getInputStream();
                BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream))
        ) {
            body = bufferedReader.lines().collect(joining(System.lineSeparator()));
        } catch (IOException ignored) {
        }

        return body;
    }
}