-- 서버 푸시를 위한 기기 토큰. 지금은 알림을 앱이 직접 쏘므로 쌓이기만 한다.

create table device_token
(
    id          bigint       not null auto_increment comment '기기 토큰 고유 식별자',
    user_email  varchar(255) not null comment '유저 이메일',
    token       varchar(255) not null comment '푸시 토큰. 같은 기기는 한 행이어야 두 번 보내지 않는다',
    platform    varchar(10)  not null comment '플랫폼 (IOS, ANDROID)',
    create_time datetime(6)  not null,
    update_time datetime(6)  not null,
    primary key (id),
    constraint uk_device_token unique (token)
) engine = InnoDB;

create index idx_device_token_user_email on device_token (user_email);
