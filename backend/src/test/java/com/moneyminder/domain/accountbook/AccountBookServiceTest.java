package com.moneyminder.domain.accountbook;

import com.moneyminder.domain.accountbook.application.AccountBookService;
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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.jdbc.core.JdbcTemplate;

import java.math.BigInteger;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

@SpringBootTest
public class AccountBookServiceTest {

    @Autowired
    private AccountBookService accountBookService;

    @Autowired
    private AccountBookRepository accountBookRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @SpyBean
    private CategoryRepository categoryRepository;

    @BeforeEach
    void setUp() {
        jdbcTemplate.update("TRUNCATE TABLE account_book");
        jdbcTemplate.update("ALTER TABLE account_book ALTER COLUMN id RESTART WITH 1");

        accountBookRepository.save(AccountBook.builder()
                .userEmail("테스트이메일")
                .categoryCode("카테고리코드")
                .memo("메모")
                .transactionDate(LocalDate.now())
                .amount(BigInteger.valueOf(10000))
                .build());

        given(categoryRepository.existsByCategoryCode("카테고리코드")).willReturn(true);
    }

    @Nested
    class 성공테스트 {

        @DisplayName("생성 - 성공적으로 가계부를 생성한다.")
        @Test
        void whenCreateAccountBook_thenSuccess() {
            // given
            AccountBookServiceCreateReq request = AccountBookServiceCreateReq.builder()
                    .userEmail("테스트이메일")
                    .memo("메모")
                    .categoryCode("카테고리코드")
                    .transactionDate(LocalDate.now())
                    .amount(BigInteger.valueOf(99999))
                    .build();

            // when
            accountBookService.create(request);
            AccountBook accountBook = accountBookRepository.getById(2L);

            // then
            assertThat(accountBook.userEmail()).isEqualTo("테스트이메일");
            assertThat(accountBook.categoryCode()).isEqualTo("카테고리코드");
            assertThat(accountBook.memo()).isEqualTo("메모");
            assertThat(accountBook.amount()).isEqualTo(BigInteger.valueOf(99999));
        }


        @DisplayName("수정 - 기존 가계부를 성공적으로 수정한다.")
        @Test
        void whenUpdateAccountBook_thenSuccess() {
            // given
            AccountBookServiceUpdateReq request = AccountBookServiceUpdateReq.builder()
                    .accountId(1L)
                    .userEmail("테스트이메일")
                    .categoryCode("수정 카테고리")
                    .memo("수정된 메모")
                    .transactionDate(LocalDate.now())
                    .amount(BigInteger.valueOf(100000))
                    .build();

            given(categoryRepository.existsByCategoryCode(request.categoryCode())).willReturn(true);

            // when
            accountBookService.update(request);
            AccountBook accountBook = accountBookRepository.getById(1L);

            // then
            assertThat(accountBook.userEmail()).isEqualTo("테스트이메일");
            assertThat(accountBook.categoryCode()).isEqualTo("수정 카테고리");
            assertThat(accountBook.memo()).isEqualTo("수정된 메모");
            assertThat(accountBook.amount()).isEqualTo(BigInteger.valueOf(100000));
        }

        @DisplayName("삭제 - 특정 가계부를 성공적으로 삭제한다.")
        @Test
        void whenDeleteAccountBook_thenSuccess() {
            // given
            AccountBook accountBook = accountBookRepository.getById(1L);

            // when
            accountBookService.delete(accountBook.accountId(), "테스트이메일");

            // then
            assertThat(accountBookRepository.findById(1L)).isEmpty();
        }

        @DisplayName("조회 - ID로 가계부를 성공적으로 조회한다.")
        @Test
        void whenGetAccountBookById_thenSuccess() {
            // when
            AccountBookServiceDefaultRes accountBook = accountBookService.getById(1L);

            // then
            assertThat(accountBook.accountId()).isEqualTo(1L);
            assertThat(accountBook.memo()).isEqualTo("메모");
        }

        @DisplayName("조회 - 이메일로 가계부를 성공적으로 조회한다.")
        @Test
        void whenGetAccountBookByEmail_thenSuccess() {
            //given
            accountBookRepository.save(AccountBook.builder()
                    .userEmail("조회되지않는이메일")
                    .categoryCode("카테고리코드2")
                    .memo("메모2")
                    .transactionDate(LocalDate.now())
                    .amount(BigInteger.valueOf(10000))
                    .build());

            // when
            List<AccountBookServiceDefaultRes> accountBookServiceDefaultResList = accountBookService.getByUserEmail("테스트이메일");

            // then
            assertThat(accountBookServiceDefaultResList).hasSize(1);
        }

        @DisplayName("조회 - 가계부 조회시 카테고리가 없는 경우 기본 카테고리로 대체한다.")
        @Test
        void whenGetAccountBookByCategoryIsNull_thenSuccess() {
            //given
            accountBookRepository.save(AccountBook.builder()
                    .userEmail("테스트이메일")
                    .categoryCode("")
                    .memo("메모")
                    .transactionDate(LocalDate.now())
                    .amount(BigInteger.valueOf(10000))
                    .build());

            // when
            List<AccountBookServiceDefaultRes> accountBookServiceDefaultResList = accountBookService.getByUserEmail("테스트이메일");

            // then
            assertThat(accountBookServiceDefaultResList).hasSize(2);
            assertThat(accountBookServiceDefaultResList.get(1).categoryCode()).isEqualTo(Category.DEFAULT_CATEGORY_CODE);
        }

        @DisplayName("조회 - 이메일로 가계부 조회시 결과가 없으면 빈 리스트를 반환한다.")
        @Test
        void whenGetAccountBookByEmail_thenEmptyList() {
            // when
            List<AccountBookServiceDefaultRes> accountBookServiceDefaultResList = accountBookService.getByUserEmail("다른이메일");

            // then
            assertThat(accountBookServiceDefaultResList).isEmpty();
        }

        @DisplayName("조회 - 검색조건에 카테고리 코드가 없는 경우 전체 카테고리로 조회한다.")
        @Test
        void whenGetAccountBookBySearchCategoryIsNull_thenSuccess() {
            //given
            accountBookRepository.save(AccountBook.builder()
                    .userEmail("테스트이메일")
                    .categoryCode("카테고리코드2")
                    .memo("메모2")
                    .transactionDate(LocalDate.now())
                    .amount(BigInteger.valueOf(10000))
                    .build());

            // when
            List<AccountBookServiceDefaultRes> accountBookServiceDefaultResList = accountBookService.getByUserEmailAndSearch(
                    "테스트이메일",
                    AccountBookServiceSearchReq.builder().build()
            );

            // then
            assertThat(accountBookServiceDefaultResList).hasSize(2);
        }

        @DisplayName("조회 - 검색조건에 카테고리 코드가 있는 경우 해당 카테고리로 조회한다.")
        @Test
        void whenGetAccountBookBySearchCategoryIsNotNull_thenSuccess() {
            //given
            accountBookRepository.save(AccountBook.builder()
                    .userEmail("테스트이메일")
                    .categoryCode("카테고리코드2")
                    .memo("메모2")
                    .transactionDate(LocalDate.now())
                    .amount(BigInteger.valueOf(10000))
                    .build());

            // when
            List<AccountBookServiceDefaultRes> accountBookServiceDefaultResList = accountBookService.getByUserEmailAndSearch(
                    "테스트이메일", AccountBookServiceSearchReq.builder().categoryCode("카테고리코드2").build());

            // then
            assertThat(accountBookServiceDefaultResList).hasSize(1);
        }

        @DisplayName("조회 - 검색조건에 메모가 있는 경우 해당 메모로 조회한다.")
        @Test
        void whenGetAccountBookBySearchMemoIsNotNull_thenSuccess() {
            //given
            accountBookRepository.save(AccountBook.builder()
                    .userEmail("테스트이메일")
                    .categoryCode("카테고리코드2")
                    .memo("메모2")
                    .transactionDate(LocalDate.now())
                    .amount(BigInteger.valueOf(10000))
                    .build());

            // when
            List<AccountBookServiceDefaultRes> accountBookServiceDefaultResList = accountBookService.getByUserEmailAndSearch(
                    "테스트이메일", AccountBookServiceSearchReq.builder().memo("메모2").build());

            // then
            assertThat(accountBookServiceDefaultResList).hasSize(1);
        }

        @DisplayName("조회 - 검색조건에 시작일과 종료일이 있는 경우 해당 기간으로 조회한다.")
        @Test
        void whenGetAccountBookBySearchDateIsNotNull_thenSuccess() {
            //given
            accountBookRepository.save(AccountBook.builder()
                    .userEmail("테스트이메일")
                    .categoryCode("카테고리코드2")
                    .memo("메모2")
                    .transactionDate(LocalDate.now())
                    .amount(BigInteger.valueOf(10000))
                    .build());

            // when
            List<AccountBookServiceDefaultRes> accountBookServiceDefaultResList = accountBookService.getByUserEmailAndSearch(
                    "테스트이메일",
                    AccountBookServiceSearchReq.builder().startDate(LocalDate.now().minusDays(1))
                            .endDate(LocalDate.now().plusDays(1)).build());

            // then
            assertThat(accountBookServiceDefaultResList).hasSize(2);
        }

        @DisplayName("조회 - 검색조건에 시작일과 종료일이 없는 경우 전체 기간으로 조회한다.")
        @Test
        void whenGetAccountBookBySearchDateIsNull_thenSuccess() {
            //given
            accountBookRepository.save(AccountBook.builder()
                    .userEmail("테스트이메일")
                    .categoryCode("카테고리코드2")
                    .memo("메모2")
                    .transactionDate(LocalDate.now())
                    .amount(BigInteger.valueOf(10000))
                    .build());

            // when
            List<AccountBookServiceDefaultRes> accountBookServiceDefaultResList = accountBookService.getByUserEmailAndSearch(
                    "테스트이메일",
                    AccountBookServiceSearchReq.builder().startDate(null).endDate(null).build());

            // then
            assertThat(accountBookServiceDefaultResList).hasSize(2);
        }

        @DisplayName("조회 - 검색조건에 시작일이 종료일보다 큰 경우 빈 리스트를 반환한다.")
        @Test
        void whenGetAccountBookBySearchDateIsInvalid_thenEmptyList() {
            //given
            accountBookRepository.save(AccountBook.builder()
                    .userEmail("테스트이메일")
                    .categoryCode("카테고리코드2")
                    .memo("메모2")
                    .transactionDate(LocalDate.now())
                    .amount(BigInteger.valueOf(10000))
                    .build());

            // when
            List<AccountBookServiceDefaultRes> accountBookServiceDefaultResList = accountBookService.getByUserEmailAndSearch(
                    "테스트이메일",
                    AccountBookServiceSearchReq.builder().startDate(LocalDate.now().plusDays(1))
                            .endDate(LocalDate.now()).build());

            // then
            assertThat(accountBookServiceDefaultResList).isEmpty();
        }

        @DisplayName("조회 - 검색조건에 시작일이 없는 경우 종료일까지 조회한다.")
        @Test
        void whenGetAccountBookBySearchStartDateIsNull_thenSuccess() {
            //given
            accountBookRepository.save(AccountBook.builder()
                    .userEmail("테스트이메일")
                    .categoryCode("카테고리코드2")
                    .memo("메모2")
                    .transactionDate(LocalDate.now())
                    .amount(BigInteger.valueOf(10000))
                    .build());

            // when
            List<AccountBookServiceDefaultRes> accountBookServiceDefaultResList = accountBookService.getByUserEmailAndSearch(
                    "테스트이메일", AccountBookServiceSearchReq.builder().endDate(LocalDate.now()).build());

            // then
            assertThat(accountBookServiceDefaultResList).hasSize(2);
        }

        @DisplayName("조회 - 검색조건에 종료일이 없는 경우 시작일부터 조회한다.")
        @Test
        void whenGetAccountBookBySearchEndDateIsNull_thenSuccess() {
            //given
            accountBookRepository.save(AccountBook.builder()
                    .userEmail("테스트이메일")
                    .categoryCode("카테고리코드2")
                    .memo("메모2")
                    .transactionDate(LocalDate.now())
                    .amount(BigInteger.valueOf(10000))
                    .build());

            // when
            List<AccountBookServiceDefaultRes> accountBookServiceDefaultResList = accountBookService.getByUserEmailAndSearch(
                    "테스트이메일",
                    AccountBookServiceSearchReq.builder().startDate(LocalDate.now()).build());

            // then
            assertThat(accountBookServiceDefaultResList).hasSize(2);
        }

    }

    @Nested
    class 예외테스트 {

        @DisplayName("생성 - 가계부 생성시 카테고리가 존재하지 않는 경우 예외를 발생시킨다.")
        @Test
        void whenCreateAccountBook_thenThrowException() {
            // given
            AccountBookServiceCreateReq request = AccountBookServiceCreateReq.builder()
                    .userEmail("테스트이메일")
                    .memo("메모")
                    .categoryCode("존재하지 않는 카테고리")
                    .transactionDate(LocalDate.now())
                    .amount(BigInteger.valueOf(99999))
                    .build();

            // when & then
            assertThatThrownBy(() -> accountBookService.create(request))
                    .isInstanceOf(BaseException.class)
                    .hasMessage(ResultCode.CATEGORY_NOT_FOUND.getMessage());
        }

        @DisplayName("수정 - 가계부 수정시 사용자 이메일이 다른 경우 예외를 발생시킨다.")
        @Test
        void whenUpdateAccountBook_thenThrowException() {
            // given
            AccountBookServiceUpdateReq request = AccountBookServiceUpdateReq.builder()
                    .accountId(1L)
                    .userEmail("다른이메일")
                    .categoryCode("수정 카테고리")
                    .memo("수정된 메모")
                    .transactionDate(LocalDate.now())
                    .amount(BigInteger.valueOf(100000))
                    .build();

            given(categoryRepository.existsByCategoryCode(request.categoryCode())).willReturn(true);

            // when & then
            assertThatThrownBy(() -> accountBookService.update(request))
                    .isInstanceOf(BaseException.class)
                    .hasMessage(ResultCode.ACCOUNT_BOOK_FORBIDDEN.getMessage());
        }

        @DisplayName("삭제 - 가계부 삭제시 사용자 이메일이 다른 경우 예외를 발생시킨다.")
        @Test
        void whenDeleteAccountBook_thenThrowException() {
            // given
            AccountBook accountBook = accountBookRepository.getById(1L);

            // when & then
            assertThatThrownBy(() -> accountBookService.delete(accountBook.accountId(), "다른이메일"))
                    .isInstanceOf(BaseException.class)
                    .hasMessage(ResultCode.ACCOUNT_BOOK_FORBIDDEN.getMessage());
        }

        @DisplayName("조회 - ID로 가계부 조회시 가계부가 존재하지 않는 경우 예외를 발생시킨다.")
        @Test
        void whenGetAccountBookById_thenThrowException() {
            // when & then
            assertThatThrownBy(() -> accountBookService.getById(999L))
                    .isInstanceOf(BaseException.class)
                    .hasMessage(ResultCode.ACCOUNT_BOOK_NOT_FOUND.getMessage());
        }


    }


}
