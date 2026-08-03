-- 앱이 카테고리마다 아이콘과 색을 갖는다. 이 둘이 서버에 없으면 기기를 바꿀 때 사라진다.
-- 기본 카테고리(DC001~DC017)는 비워 둔다 — 앱이 자기 것만 그리고 나머지는 폴백으로 읽는다.

-- 한 문장에 두 컬럼을 붙이면 H2 가 콤마에서 멈춘다. FlywayBaselineTest 가 H2 로 돈다.
alter table category
    add column icon varchar(30) null comment '아이콘 이름. 앱이 정한 이름을 그대로 담는다';

alter table category
    add column color varchar(30) null comment '색 토큰 이름. 앱이 정한 이름을 그대로 담는다';
