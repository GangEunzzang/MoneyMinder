package com.moneyminder.domain.accountbook.infrastructure.jpa.entity;

import com.moneyminder.domain.accountbook.domain.AccountBook;
import com.moneyminder.global.base.BaseTimeEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.math.BigInteger;
import java.time.LocalDate;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLDelete(sql = "UPDATE account_book SET is_deleted = TRUE WHERE id = ?")
@SQLRestriction("is_deleted = false")
@DynamicInsert
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

    @Comment("삭제 여부")
    @ColumnDefault("false")
    private Boolean isDeleted = Boolean.FALSE;

    @Builder
    private AccountBookEntity(Long id, String categoryCode, String userEmail, BigInteger amount,
            LocalDate transactionDate, String memo, boolean isDeleted) {
        this.id = id;
        this.categoryCode = categoryCode;
        this.userEmail = userEmail;
        this.amount = amount;
        this.transactionDate = transactionDate;
        this.memo = memo;
        this.isDeleted = isDeleted;
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
