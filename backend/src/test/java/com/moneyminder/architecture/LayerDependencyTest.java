package com.moneyminder.architecture;

import static com.moneyminder.architecture.ArchConditions.beInLowerCasePackage;
import static com.moneyminder.architecture.ArchConditions.beReadOnlyTransactional;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.methods;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;
import com.tngtech.archunit.library.freeze.FreezingArchRule;

/**
 * 기존 위반은 archunit_store 에 동결돼 통과하고, 새 위반만 실패한다.
 * 동결 목록을 하나씩 비우는 것이 리팩토링의 진행률이다.
 */
@AnalyzeClasses(packages = "com.moneyminder", importOptions = ImportOption.DoNotIncludeTests.class)
class LayerDependencyTest {

    private static final String DOMAIN = "com.moneyminder.domain.*.domain..";
    private static final String APPLICATION = "com.moneyminder.domain.*.application..";
    private static final String PRESENTATION = "com.moneyminder.domain.*.presentation..";
    private static final String[] INFRASTRUCTURE = {
            "com.moneyminder.domain.*.infrastructure..",
            "com.moneyminder.domain.*.Infrastructure.."
    };

    @ArchTest
    static final ArchRule 도메인은_인프라를_모른다 = FreezingArchRule.freeze(
            noClasses().that().resideInAPackage(DOMAIN)
                    .should().dependOnClassesThat().resideInAnyPackage(INFRASTRUCTURE)
                    .as("domain 계층은 infrastructure 를 import 하지 않는다")
                    .because("의존은 안쪽으로만 흐른다 — 저장소를 바꿔도 도메인은 그대로여야 한다"));

    @ArchTest
    static final ArchRule 도메인은_서비스를_모른다 = FreezingArchRule.freeze(
            noClasses().that().resideInAPackage(DOMAIN)
                    .should().dependOnClassesThat().resideInAnyPackage(APPLICATION, PRESENTATION)
                    .as("domain 계층은 application·presentation 을 import 하지 않는다")
                    .because("조회 결과를 DTO 로 바로 받으려다 계층이 뒤집혔다"));

    @ArchTest
    static final ArchRule 인프라는_화면을_모른다 = FreezingArchRule.freeze(
            noClasses().that().resideInAnyPackage(INFRASTRUCTURE)
                    .should().dependOnClassesThat().resideInAPackage(PRESENTATION)
                    .as("infrastructure 는 presentation 을 import 하지 않는다"));

    @ArchTest
    static final ArchRule 패키지는_소문자다 = FreezingArchRule.freeze(
            classes().that().resideInAPackage("com.moneyminder..")
                    .should(beInLowerCasePackage()));

    @ArchTest
    static final ArchRule 리포지토리_구현은_인프라에_있다 = FreezingArchRule.freeze(
            classes().that().haveSimpleNameEndingWith("RepositoryImpl")
                    .or().haveSimpleNameEndingWith("JpaRepository")
                    .should().resideInAnyPackage(INFRASTRUCTURE)
                    .as("Repository 구현체는 infrastructure 아래 둔다"));

    @ArchTest
    static final ArchRule 조회는_읽기전용이다 = FreezingArchRule.freeze(
            methods().that().areDeclaredInClassesThat().haveSimpleNameEndingWith("Service")
                    .and().arePublic()
                    .and().haveNameStartingWith("get")
                    .should(beReadOnlyTransactional())
                    .because("쓰기 트랜잭션으로 조회가 돌면 flush·dirty check 비용을 그대로 문다"));
}
