package com.moneyminder.global.application;

import com.moneyminder.global.factory.SlackMessageFactory;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import net.gpedro.integrations.slack.SlackApi;
import net.gpedro.integrations.slack.SlackMessage;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.task.TaskExecutor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class SlackService {

    private final SlackApi slackApi;
    private final SlackMessageFactory slackMessageFactory;

    @Qualifier("slackTaskExecutor")
    private final TaskExecutor taskExecutor;

    public void send(HttpServletRequest request, Exception exception) {
        SlackMessage slackMessage = slackMessageFactory.generateErrorMessage(request, exception);
        taskExecutor.execute(() -> slackApi.call(slackMessage));
    }
}
