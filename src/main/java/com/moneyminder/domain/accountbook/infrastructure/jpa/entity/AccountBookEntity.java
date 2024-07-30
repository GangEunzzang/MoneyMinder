package com.moneyminder.domain.accountbook.infrastructure.jpa.entity;

import com.moneyminder.domain.accountbook.domain.AccountBook;
import com.moneyminder.global.base.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;

import java.math.BigInteger;
import java.time.LocalDate;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "account_book", indexes = {
        @Index(name = "idx_accountbook_user_email", columnList = "user_email")
})
public class AccountBookEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Comment("가계부 고유 식별자")
    private Long id;

    @Comment("카테고리 코드")
    private String categoryCode;

    @Comment("유저 이메일")
    private String userEmail;

    @Comment("거래 금액")
    private BigInteger amount = BigInteger.ZERO;

    @Comment("거래 일시 (yyyy-MM-dd)")
    private LocalDate transactionDate;

    @Comment("메모")
    private String memo;

    @Builder
    private AccountBookEntity(Long id, String categoryCode, String userEmail, BigInteger amount, LocalDate transactionDate, String memo) {
        this.id = id;
        this.categoryCode = categoryCode;
        this.userEmail = userEmail;
        this.amount = amount;
        this.transactionDate = transactionDate;
        this.memo = memo;
    }

    public AccountBook toDomain() {
        return AccountBook.builder()
                .accountId(id)
                .categoryCode(categoryCode)
                .userEmail(userEmail)
                .amount(amount)
                .transactionDate(transactionDate)
                .memo(memo)
                .build();
    }



}
