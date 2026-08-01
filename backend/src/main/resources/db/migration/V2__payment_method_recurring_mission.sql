-- 결제수단 · 고정지출 · 미션. 거래에 결제수단과 상호를 붙인다.

create table payment_method
(
    id           bigint       not null auto_increment comment '결제수단 고유 식별자',
    user_email   varchar(255) not null comment '유저 이메일',
    name         varchar(30)  not null comment '결제수단 이름',
    kind         varchar(10)  not null comment '결제수단 종류 (CARD, CASH, ACCOUNT)',
    color        varchar(20) comment '팔레트 토큰 이름',
    billing_day  integer comment '신용카드 결제일 (1~31). 카드가 아니면 없다',
    sort_order   integer     default 0 comment '목록 정렬 순서',
    is_deleted   bit         default false comment '삭제 여부',
    create_time  datetime(6)  not null,
    update_time  datetime(6)  not null,
    primary key (id)
) engine = InnoDB;

create index idx_payment_method_user_email on payment_method (user_email);

create table recurring
(
    id                  bigint       not null auto_increment comment '고정지출 고유 식별자',
    user_email          varchar(255) not null comment '유저 이메일',
    name                varchar(50)  not null comment '고정지출 이름',
    amount              decimal(38, 0) comment '금액',
    cycle_day           integer      not null comment '매월 결제일 (1~31). 없는 날짜는 말일로 당긴다',
    category_code       varchar(255) comment '카테고리 코드',
    payment_method_id   bigint comment '결제수단 식별자',
    auto_record         bit         default true comment '결제일에 자동으로 기록할지',
    remind_before_days  integer     default 3 comment '결제 며칠 전에 알릴지 (0이면 알리지 않음)',
    last_recorded_month varchar(7) comment '마지막으로 자동기록된 달 (yyyy-MM). 중복 기록을 막는다',
    is_deleted          bit         default false comment '삭제 여부',
    create_time         datetime(6)  not null,
    update_time         datetime(6)  not null,
    primary key (id)
) engine = InnoDB;

create index idx_recurring_user_email on recurring (user_email);

create table mission
(
    id           bigint       not null auto_increment comment '미션 고유 식별자',
    user_email   varchar(255) not null comment '유저 이메일',
    mission_code varchar(30)  not null comment '미션 종류 (앱이 가진 스펙의 식별자)',
    target       integer comment '목표치. 단위는 미션 종류가 정한다',
    period       varchar(10)  not null comment '회차 단위 (WEEK, MONTH, FOREVER)',
    started_on   date comment '시작일',
    status       varchar(10)  not null comment '진행 상태 (ACTIVE, STOPPED)',
    create_time  datetime(6)  not null,
    update_time  datetime(6)  not null,
    primary key (id)
) engine = InnoDB;

create index idx_mission_user_email on mission (user_email);

alter table account_book
    add column payment_method_id bigint comment '결제수단 식별자';

alter table account_book
    add column merchant varchar(255) comment '상호';

alter table account_book
    add column auto_recorded bit default false comment '고정지출에서 자동 기록된 건지';
