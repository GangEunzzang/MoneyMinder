package com.moneyminder.domain.recurring.presentation;

import com.moneyminder.domain.recurring.application.RecurringService;
import com.moneyminder.domain.recurring.application.dto.response.RecurringServiceRes;
import com.moneyminder.domain.recurring.presentation.dto.RecurringCreateReq;
import com.moneyminder.domain.recurring.presentation.dto.RecurringUpdateReq;
import com.moneyminder.global.annotation.CurrentUserEmail;
import com.moneyminder.global.response.DataResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/recurrings")
@RestController
public class RecurringController {

    private final RecurringService recurringService;

    @PostMapping
    public DataResponse<RecurringServiceRes> create(@CurrentUserEmail String email,
            @Valid @RequestBody RecurringCreateReq request) {
        return DataResponse.of(recurringService.create(request.toService(email)));
    }

    @PutMapping("/{recurringId}")
    public DataResponse<RecurringServiceRes> update(@CurrentUserEmail String email, @PathVariable Long recurringId,
            @Valid @RequestBody RecurringUpdateReq request) {
        return DataResponse.of(recurringService.update(request.toService(recurringId, email)));
    }

    @DeleteMapping("/{recurringId}")
    public DataResponse<Void> delete(@CurrentUserEmail String email, @PathVariable Long recurringId) {
        recurringService.delete(recurringId, email);

        return DataResponse.empty();
    }

    @GetMapping("/{recurringId}")
    public DataResponse<RecurringServiceRes> getById(@CurrentUserEmail String email, @PathVariable Long recurringId) {
        return DataResponse.of(recurringService.getById(recurringId, email));
    }

    @GetMapping
    public DataResponse<List<RecurringServiceRes>> getMine(@CurrentUserEmail String email) {
        return DataResponse.of(recurringService.getByUserEmail(email));
    }

    /**
     * 결제일이 지난 고정지출을 거래로 만든다. 같은 달에 여러 번 불러도 한 번만 기록된다.
     */
    @PostMapping("/auto-record")
    public DataResponse<List<RecurringServiceRes>> runAutoRecord(@CurrentUserEmail String email) {
        return DataResponse.of(recurringService.runAutoRecord(email));
    }
}
