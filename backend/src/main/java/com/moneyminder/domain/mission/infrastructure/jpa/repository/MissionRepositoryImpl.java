package com.moneyminder.domain.mission.infrastructure.jpa.repository;

import com.moneyminder.domain.mission.domain.Mission;
import com.moneyminder.domain.mission.domain.repository.MissionRepository;
import com.moneyminder.domain.mission.infrastructure.jpa.entity.MissionEntity;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@RequiredArgsConstructor
@Repository
public class MissionRepositoryImpl implements MissionRepository {

    private final MissionJpaRepository jpaRepository;

    @Override
    public Mission save(Mission mission) {
        return jpaRepository.save(MissionEntity.from(mission)).toDomain();
    }

    @Override
    public void delete(Mission mission) {
        jpaRepository.delete(MissionEntity.from(mission));
    }

    @Override
    public void deleteAllInBatch() {
        jpaRepository.deleteAllInBatch();
    }

    @Override
    public Mission getById(Long id) {
        return findById(id).orElseThrow(() -> new BaseException(ResultCode.MISSION_NOT_FOUND));
    }

    @Override
    public Optional<Mission> findById(Long id) {
        return jpaRepository.findById(id).map(MissionEntity::toDomain);
    }

    @Override
    public List<Mission> findByUserEmail(String email) {
        return jpaRepository.findByUserEmailOrderByIdAsc(email).stream()
                .map(MissionEntity::toDomain)
                .toList();
    }

    @Override
    public Optional<Mission> findByUserEmailAndMissionCode(String email, String missionCode) {
        return jpaRepository.findByUserEmailAndMissionCode(email, missionCode).map(MissionEntity::toDomain);
    }
}
