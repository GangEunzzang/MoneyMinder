package com.moneyminder.domain.recurring.infrastructure.jpa.entity;

import com.moneyminder.domain.recurring.domain.Recurring;
import com.moneyminder.global.base.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.math.BigInteger;
import java.time.YearMonth;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLDelete(sql = "UPDATE recurring SET is_deleted = TRUE WHERE id = ?")
@SQLRestriction("is_deleted = false")
@Entity
@Table(name = "recurring", indexes = {
        @Index(name = "idx_recurring_user_email", columnList = "user_email")
})
public class RecurringEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Comment("고정지출 고유 식별자")
    private Long id;

    @Column(nullable = false)
    @Comment("유저 이메일")
    private String userEmail;

    @Column(nullable = false, length = 50)
    @Comment("고정지출 이름")
    private String name;

    @Comment("금액")
    private BigInteger amount;

    @Column(nullable = false)
    @Comment("매월 결제일 (1~31). 없는 날짜는 말일로 당긴다")
    private int cycleDay;

    @Comment("카테고리 코드")
    private String categoryCode;

    @Comment("결제수단 식별자")
    private Long paymentMethodId;

    @ColumnDefault("true")
    @Comment("결제일에 자동으로 기록할지")
    private boolean autoRecord;

    @ColumnDefault("3")
    @Comment("결제 며칠 전에 알릴지 (0이면 알리지 않음)")
    private int remindBeforeDays;

    @Column(length = 7)
    @Comment("마지막으로 자동기록된 달 (yyyy-MM). 중복 기록을 막는다")
    private String lastRecordedMonth;

    @Comment("삭제 여부")
    @ColumnDefault("false")
    private Boolean isDeleted = Boolean.FALSE;

    @Builder
    private RecurringEntity(Long id, String userEmail, String name, BigInteger amount, int cycleDay,
            String categoryCode, Long paymentMethodId, boolean autoRecord, int remindBeforeDays,
            String lastRecordedMonth, boolean isDeleted) {
        this.id = id;
        this.userEmail = userEmail;
        this.name = name;
        this.amount = amount;
        this.cycleDay = cycleDay;
        this.categoryCode = categoryCode;
        this.paymentMethodId = paymentMethodId;
        this.autoRecord = autoRecord;
        this.remindBeforeDays = remindBeforeDays;
        this.lastRecordedMonth = lastRecordedMonth;
        this.isDeleted = isDeleted;
    }

    public static RecurringEntity from(Recurring recurring) {
        return RecurringEntity.builder()
                .id(recurring.getId())
                .userEmail(recurring.getUserEmail())
                .name(recurring.getName())
                .amount(recurring.getAmount())
                .cycleDay(recurring.getCycleDay())
                .categoryCode(recurring.getCategoryCode())
                .paymentMethodId(recurring.getPaymentMethodId())
                .autoRecord(recurring.isAutoRecord())
                .remindBeforeDays(recurring.getRemindBeforeDays())
                .lastRecordedMonth(recurring.getLastRecordedMonth() == null
                        ? null
                        : recurring.getLastRecordedMonth().toString())
                .build();
    }

    public Recurring toDomain() {
        return Recurring.builder()
                .id(id)
                .userEmail(userEmail)
                .name(name)
                .amount(amount)
                .cycleDay(cycleDay)
                .categoryCode(categoryCode)
                .paymentMethodId(paymentMethodId)
                .autoRecord(autoRecord)
                .remindBeforeDays(remindBeforeDays)
                .lastRecordedMonth(lastRecordedMonth == null ? null : YearMonth.parse(lastRecordedMonth))
                .build();
    }
}
