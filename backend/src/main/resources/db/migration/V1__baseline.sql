-- 엔티티에서 Hibernate 가 생성한 DDL 을 그대로 옮긴 것이다.
-- 손으로 쓰면 ddl-auto=validate 가 미묘한 타입 차이로 깨지므로 생성 결과를 정본으로 둔다.
-- 재생성: SchemaExporter 테스트 실행 → build/schema-mysql.sql

create table users
(
    id                bigint                                          not null auto_increment comment '사용자 고유 식별자',
    email             varchar(255) comment '사용자 이메일',
    name              varchar(255) comment '사용자 이름',
    password          varchar(255) comment '사용자 비밀번호',
    social_type       enum ('GOOGLE','KAKAO','NAVER','NORMAL') comment '가입 소셜 종류',
    user_role         enum ('ADMIN','GUEST','USER') comment '유저 권한',
    is_email_verified bit comment '이메일 인증 여부',
    create_time       datetime(6)                                     not null,
    update_time       datetime(6)                                     not null,
    primary key (id),
    constraint uk_users_email unique (email)
) engine = InnoDB;

create table category
(
    id            bigint       not null auto_increment comment '카테고리 고유 식별자',
    category_code varchar(30)  not null comment '카테고리 코드',
    category_name varchar(255) comment '카테고리 이름',
    category_type varchar(255) comment '카테고리 유형 (수입 또는 지출)',
    description   varchar(255) comment '카테고리 설명',
    user_email    varchar(255) comment '유저 이메일',
    is_custom     bit          not null comment '사용자 정의 여부',
    is_deleted    bit default false comment '삭제 여부',
    primary key (id),
    constraint uk_category_code unique (category_code)
) engine = InnoDB;

create index idx_category_user_email on category (user_email);

create table account_book
(
    id               bigint      not null auto_increment comment '가계부 고유 식별자',
    category_code    varchar(255) comment '카테고리 코드',
    user_email       varchar(255) comment '유저 이메일',
    amount           decimal(38, 0) comment '거래 금액',
    transaction_date date comment '거래 일시 (yyyy-MM-dd)',
    memo             varchar(255) comment '메모',
    is_deleted       bit default false comment '삭제 여부',
    create_time      datetime(6) not null,
    update_time      datetime(6) not null,
    primary key (id)
) engine = InnoDB;

create index idx_accountbook_user_email on account_book (user_email);

create table budget
(
    id            bigint      not null auto_increment comment '예산 고유 식별자',
    budget_year   integer     not null comment '예산 연도',
    budget_month  integer     not null comment '예산 월',
    amount        decimal(38, 0) comment '예산 금액',
    category_code varchar(255) comment '카테고리 코드',
    user_email    varchar(255) comment '유저 이메일',
    create_time   datetime(6) not null,
    update_time   datetime(6) not null,
    primary key (id)
) engine = InnoDB;

create index idx_budget_user_email on budget (user_email);
