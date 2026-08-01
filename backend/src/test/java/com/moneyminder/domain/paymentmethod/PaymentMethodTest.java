package com.moneyminder.domain.paymentmethod;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.moneyminder.domain.paymentmethod.domain.PaymentMethod;
import com.moneyminder.domain.paymentmethod.domain.type.PaymentKind;
import com.moneyminder.global.exception.BaseException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

class PaymentMethodTest {

    @Nested
    class 결제일 {

        @DisplayName("신용카드는 결제일을 갖는다.")
        @Test
        void whenCard_thenBillingDayAllowed() {
            PaymentMethod card = PaymentMethod.create("테스트이메일", "신한카드", PaymentKind.CARD, "violet", 25, 0);

            assertThat(card.getBillingDay()).isEqualTo(25);
            assertThat(card.hasBillingDay()).isTrue();
            assertThat(card.isCard()).isTrue();
        }

        @DisplayName("체크카드는 결제일이 없어도 된다.")
        @Test
        void whenCardWithoutBillingDay_thenOk() {
            PaymentMethod card = PaymentMethod.create("테스트이메일", "체크카드", PaymentKind.CARD, "mint", null, 0);

            assertThat(card.hasBillingDay()).isFalse();
        }

        @DisplayName("현금·계좌에 결제일을 붙이면 거부한다.")
        @Test
        void whenNotCard_thenBillingDayRejected() {
            assertThatThrownBy(
                    () -> PaymentMethod.create("테스트이메일", "현금", PaymentKind.CASH, "ink", 25, 0))
                    .isInstanceOf(BaseException.class);

            assertThatCode(() -> PaymentMethod.create("테스트이메일", "현금", PaymentKind.CASH, "ink", null, 0))
                    .doesNotThrowAnyException();
        }

        @DisplayName("결제일이 1~31 밖이면 거부한다.")
        @Test
        void whenBillingDayOutOfRange_thenThrow() {
            assertThatThrownBy(
                    () -> PaymentMethod.create("테스트이메일", "신한카드", PaymentKind.CARD, "violet", 32, 0))
                    .isInstanceOf(BaseException.class);
        }

        @DisplayName("카드에서 현금으로 바꾸면서 결제일을 남기면 거부한다.")
        @Test
        void whenChangeToCashKeepingBillingDay_thenThrow() {
            PaymentMethod card = PaymentMethod.create("테스트이메일", "신한카드", PaymentKind.CARD, "violet", 25, 0);

            assertThatThrownBy(() -> card.update("현금", PaymentKind.CASH, "ink", 25))
                    .isInstanceOf(BaseException.class);
        }
    }

    @Nested
    class 소유권 {

        @DisplayName("남의 결제수단은 건드릴 수 없다.")
        @Test
        void whenNotOwner_thenThrow() {
            PaymentMethod card = PaymentMethod.create("테스트이메일", "신한카드", PaymentKind.CARD, "violet", 25, 0);

            assertThatThrownBy(() -> card.validateOwner("다른이메일")).isInstanceOf(BaseException.class);
            assertThatCode(() -> card.validateOwner("테스트이메일")).doesNotThrowAnyException();
        }
    }
}
