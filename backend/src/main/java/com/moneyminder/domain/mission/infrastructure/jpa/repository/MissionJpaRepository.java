package com.moneyminder.domain.mission.infrastructure.jpa.repository;

import com.moneyminder.domain.mission.infrastructure.jpa.entity.MissionEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MissionJpaRepository extends JpaRepository<MissionEntity, Long> {

    List<MissionEntity> findByUserEmailOrderByIdAsc(String userEmail);

    Optional<MissionEntity> findByUserEmailAndMissionCode(String userEmail, String missionCode);
}
