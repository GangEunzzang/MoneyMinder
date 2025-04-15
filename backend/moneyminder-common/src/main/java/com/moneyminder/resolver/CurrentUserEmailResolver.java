package com.moneyminder.resolver;

import com.moneyminder.annotaion.CurrentUserEmail;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@RequiredArgsConstructor
public class CurrentUserEmailResolver implements HandlerMethodArgumentResolver {

    private static final String USER_EMAIL_HEADER = "X-USER-EMAIL";

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.getParameterAnnotation(CurrentUserEmail.class) != null &&
                String.class.isAssignableFrom(parameter.getParameterType());
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
        HttpServletRequest request = (HttpServletRequest) webRequest.getNativeRequest();
        String email = request.getHeader(USER_EMAIL_HEADER);

        if (email == null || email.isBlank()) {
            throw new IllegalStateException("Missing required header: " + USER_EMAIL_HEADER);
        }

        return email;
    }
}

