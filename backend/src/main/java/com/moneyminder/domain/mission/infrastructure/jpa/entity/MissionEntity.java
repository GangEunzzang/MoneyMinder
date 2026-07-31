package com.moneyminder.domain.mission.infrastructure.jpa.entity;

import com.moneyminder.domain.mission.domain.Mission;
import com.moneyminder.domain.mission.domain.type.MissionPeriod;
import com.moneyminder.domain.mission.domain.type.MissionStatus;
import com.moneyminder.global.base.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "mission", indexes = {
        @Index(name = "idx_mission_user_email", columnList = "user_email")
})
public class MissionEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Comment("미션 고유 식별자")
    private Long id;

    @Column(nullable = false)
    @Comment("유저 이메일")
    private String userEmail;

    @Column(nullable = false, length = 30)
    @Comment("미션 종류 (앱이 가진 스펙의 식별자)")
    private String missionCode;

    @Comment("목표치. 단위는 미션 종류가 정한다")
    private int target;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    @Comment("회차 단위 (WEEK, MONTH, FOREVER)")
    private MissionPeriod period;

    @Comment("시작일")
    private LocalDate startedOn;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    @Comment("진행 상태 (ACTIVE, STOPPED)")
    private MissionStatus status;

    @Builder
    private MissionEntity(Long id, String userEmail, String missionCode, int target, MissionPeriod period,
            LocalDate startedOn, MissionStatus status) {
        this.id = id;
        this.userEmail = userEmail;
        this.missionCode = missionCode;
        this.target = target;
        this.period = period;
        this.startedOn = startedOn;
        this.status = status;
    }

    public static MissionEntity from(Mission mission) {
        return MissionEntity.builder()
                .id(mission.getId())
                .userEmail(mission.getUserEmail())
                .missionCode(mission.getMissionCode())
                .target(mission.getTarget())
                .period(mission.getPeriod())
                .startedOn(mission.getStartedOn())
                .status(mission.getStatus())
                .build();
    }

    public Mission toDomain() {
        return Mission.builder()
                .id(id)
                .userEmail(userEmail)
                .missionCode(missionCode)
                .target(target)
                .period(period)
                .startedOn(startedOn)
                .status(status)
                .build();
    }
}
