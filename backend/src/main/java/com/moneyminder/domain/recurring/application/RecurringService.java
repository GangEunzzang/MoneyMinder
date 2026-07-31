package com.moneyminder.domain.recurring.application;

import com.moneyminder.domain.accountbook.domain.AccountBook;
import com.moneyminder.domain.accountbook.domain.repository.AccountBookRepository;
import com.moneyminder.domain.recurring.application.dto.request.RecurringServiceCreateReq;
import com.moneyminder.domain.recurring.application.dto.request.RecurringServiceUpdateReq;
import com.moneyminder.domain.recurring.application.dto.response.RecurringServiceRes;
import com.moneyminder.domain.recurring.domain.Recurring;
import com.moneyminder.domain.recurring.domain.repository.RecurringRepository;
import java.time.Clock;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Service
public class RecurringService {

    private final RecurringRepository recurringRepository;
    private final AccountBookRepository accountBookRepository;
    private final Clock clock;

    @Transactional
    public RecurringServiceRes create(RecurringServiceCreateReq request) {
        Recurring recurring = recurringRepository.save(request.toDomain());

        return RecurringServiceRes.fromDomain(recurring, today());
    }

    @Transactional
    public RecurringServiceRes update(RecurringServiceUpdateReq request) {
        Recurring recurring = recurringRepository.getById(request.recurringId());

        recurring.validateOwner(request.userEmail());
        recurring.update(request.name(), request.amount(), request.cycleDay(), request.categoryCode(),
                request.paymentMethodId(), request.autoRecord(), request.remindBeforeDays());

        recurringRepository.save(recurring);

        return RecurringServiceRes.fromDomain(recurring, today());
    }

    @Transactional
    public void delete(Long recurringId, String email) {
        Recurring recurring = recurringRepository.getById(recurringId);

        recurring.validateOwner(email);

        recurringRepository.delete(recurring);
    }

    @Transactional(readOnly = true)
    public List<RecurringServiceRes> getByUserEmail(String email) {
        LocalDate today = today();

        return recurringRepository.findByUserEmail(email).stream()
                .map(recurring -> RecurringServiceRes.fromDomain(recurring, today))
                .toList();
    }

    @Transactional(readOnly = true)
    public RecurringServiceRes getById(Long recurringId, String email) {
        Recurring recurring = recurringRepository.getById(recurringId);

        recurring.validateOwner(email);

        return RecurringServiceRes.fromDomain(recurring, today());
    }

    /**
     * 결제일이 지났는데 이번 달에 아직 기록되지 않은 것을 거래로 만든다.
     * 멱등성은 도메인의 lastRecordedMonth 가 지킨다 — 하루에 여러 번 불려도 한 번만 기록된다.
     */
    @Transactional
    public List<RecurringServiceRes> runAutoRecord(String email) {
        LocalDate today = today();
        YearMonth thisMonth = YearMonth.from(today);

        List<Recurring> recorded = recurringRepository.findByUserEmail(email).stream()
                .filter(recurring -> recurring.shouldAutoRecord(today))
                .peek(recurring -> {
                    accountBookRepository.save(AccountBook.autoRecordOf(
                            recurring.getUserEmail(),
                            recurring.getCategoryCode(),
                            recurring.getAmount(),
                            recurring.billingDateOf(thisMonth),
                            recurring.getName(),
                            recurring.getPaymentMethodId()));

                    recurring.markRecorded(thisMonth);
                    recurringRepository.save(recurring);
                })
                .toList();

        return recorded.stream()
                .map(recurring -> RecurringServiceRes.fromDomain(recurring, today))
                .toList();
    }

    private LocalDate today() {
        return LocalDate.now(clock);
    }
}
