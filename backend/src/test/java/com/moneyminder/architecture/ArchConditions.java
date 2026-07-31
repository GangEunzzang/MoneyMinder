package com.moneyminder.architecture;

import com.tngtech.archunit.core.domain.JavaClass;
import com.tngtech.archunit.core.domain.JavaMethod;
import com.tngtech.archunit.lang.ArchCondition;
import com.tngtech.archunit.lang.ConditionEvents;
import com.tngtech.archunit.lang.SimpleConditionEvent;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

final class ArchConditions {

    private ArchConditions() {
    }

    static ArchCondition<JavaClass> beInLowerCasePackage() {
        return new ArchCondition<>("소문자 패키지에 있다") {
            @Override
            public void check(JavaClass item, ConditionEvents events) {
                String packageName = item.getPackageName();
                boolean satisfied = packageName.equals(packageName.toLowerCase());

                events.add(new SimpleConditionEvent(item, satisfied,
                        "%s 가 %s 에 있다".formatted(item.getSimpleName(), packageName)));
            }
        };
    }

    static ArchCondition<JavaMethod> beReadOnlyTransactional() {
        return new ArchCondition<>("@Transactional(readOnly = true) 를 붙인다") {
            @Override
            public void check(JavaMethod item, ConditionEvents events) {
                Optional<Transactional> annotation = item.tryGetAnnotationOfType(Transactional.class);
                boolean satisfied = annotation.isPresent() && annotation.get().readOnly();

                events.add(new SimpleConditionEvent(item, satisfied,
                        "%s.%s() 가 %s".formatted(
                                item.getOwner().getSimpleName(),
                                item.getName(),
                                annotation.isEmpty() ? "@Transactional 이 없다" : "readOnly 가 아니다")));
            }
        };
    }
}
