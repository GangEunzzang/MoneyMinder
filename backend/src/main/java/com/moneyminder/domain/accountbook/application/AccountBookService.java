package com.moneyminder.domain.accountbook.application;

import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceCreateReq;
import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceSearchReq;
import com.moneyminder.domain.accountbook.application.dto.request.AccountBookServiceUpdateReq;
import com.moneyminder.domain.accountbook.application.dto.response.AccountBookServiceDefaultRes;
import com.moneyminder.domain.accountbook.domain.AccountBook;
import com.moneyminder.domain.accountbook.domain.repository.AccountBookRepository;
import com.moneyminder.domain.category.domain.Category;
import com.moneyminder.domain.category.domain.repository.CategoryRepository;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class AccountBookService {

    private final AccountBookRepository accountBookRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public AccountBookServiceDefaultRes create(AccountBookServiceCreateReq createRequest) {
        validateCategoryCode(createRequest.categoryCode());
        AccountBook accountBook = accountBookRepository.save(createRequest.toDomain());
        return mapToServiceResponse(accountBook);
    }

    @Transactional
    public AccountBookServiceDefaultRes update(AccountBookServiceUpdateReq updateRequest) {
        validateCategoryCode(updateRequest.categoryCode());

        AccountBook currentAccountBook = accountBookRepository.getById(updateRequest.accountId());

        validateUserEmail(currentAccountBook.userEmail(), updateRequest.userEmail());

        AccountBook updatedAccountBook = currentAccountBook.update(updateRequest.toDomain());
        accountBookRepository.save(updatedAccountBook);

        return mapToServiceResponse(updatedAccountBook);
    }

    @Transactional
    public void delete(Long accountId, String email) {
        AccountBook accountBook = accountBookRepository.getById(accountId);

        validateUserEmail(accountBook.userEmail(), email);

        accountBookRepository.delete(accountBook);
    }

    public AccountBookServiceDefaultRes getById(Long accountId) {
        return accountBookRepository.findWithCategoryById(accountId)
                .orElseThrow(() -> new BaseException(ResultCode.ACCOUNT_BOOK_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public List<AccountBookServiceDefaultRes> getByUserEmail(String email) {
        return accountBookRepository.findWithCategoryByEmail(email);
    }

    @Transactional(readOnly = true)
    public List<AccountBookServiceDefaultRes> getByUserEmailAndSearch(String email, AccountBookServiceSearchReq searchReq) {
        return accountBookRepository.findWithCategoryByEmailAndSearch(email, searchReq);
    }

    private AccountBookServiceDefaultRes mapToServiceResponse(AccountBook accountBook) {
        Category category = categoryRepository.findByCategoryCode(accountBook.categoryCode())
                .orElseGet(Category::defaultCategory);

        return AccountBookServiceDefaultRes.fromDomain(accountBook, category);
    }

    private void validateCategoryCode(String categoryCode) {
        if (!categoryRepository.existsByCategoryCode(categoryCode)) {
            throw new BaseException(ResultCode.CATEGORY_NOT_FOUND);
        }
    }

    private void validateUserEmail(String currentEmail, String updateEmail) {
        if (!currentEmail.equals(updateEmail)) {
            throw new BaseException(ResultCode.ACCOUNT_BOOK_FORBIDDEN);
        }
    }
}