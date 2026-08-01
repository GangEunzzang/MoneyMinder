package com.moneyminder.domain.mission.domain.repository;

import com.moneyminder.domain.mission.domain.Mission;
import java.util.List;
import java.util.Optional;

public interface MissionRepository {

    Mission save(Mission mission);

    void delete(Mission mission);

    void deleteAllInBatch();

    Mission getById(Long id);

    Optional<Mission> findById(Long id);

    List<Mission> findByUserEmail(String email);

    Optional<Mission> findByUserEmailAndMissionCode(String email, String missionCode);
}
