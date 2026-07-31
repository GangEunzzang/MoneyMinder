package com.moneyminder.domain.mission.application;

import com.moneyminder.domain.mission.application.dto.request.MissionServiceStartReq;
import com.moneyminder.domain.mission.application.dto.request.MissionServiceUpdateReq;
import com.moneyminder.domain.mission.application.dto.response.MissionServiceRes;
import com.moneyminder.domain.mission.domain.Mission;
import com.moneyminder.domain.mission.domain.repository.MissionRepository;
import com.moneyminder.global.exception.BaseException;
import com.moneyminder.global.exception.ResultCode;
import java.time.Clock;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Service
public class MissionService {

    private final MissionRepository missionRepository;
    private final Clock clock;

    /**
     * 같은 미션을 두 번 시작하면 진행 상태가 갈린다. 멈춰 둔 것이 있으면 다시 켠다.
     */
    @Transactional
    public MissionServiceRes start(MissionServiceStartReq request) {
        Mission mission = missionRepository
                .findByUserEmailAndMissionCode(request.userEmail(), request.missionCode())
                .map(existing -> resume(existing, request))
                .orElseGet(() -> Mission.start(request.userEmail(), request.missionCode(), request.target(),
                        request.period(), today()));

        return MissionServiceRes.fromDomain(missionRepository.save(mission), today());
    }

    @Transactional
    public MissionServiceRes update(MissionServiceUpdateReq request) {
        Mission mission = missionRepository.getById(request.missionId());

        mission.validateOwner(request.userEmail());
        mission.changeGoal(request.target(), request.period());

        missionRepository.save(mission);

        return MissionServiceRes.fromDomain(mission, today());
    }

    @Transactional
    public void stop(Long missionId, String email) {
        Mission mission = missionRepository.getById(missionId);

        mission.validateOwner(email);
        mission.stop();

        missionRepository.save(mission);
    }

    @Transactional(readOnly = true)
    public List<MissionServiceRes> getByUserEmail(String email) {
        LocalDate today = today();

        return missionRepository.findByUserEmail(email).stream()
                .map(mission -> MissionServiceRes.fromDomain(mission, today))
                .toList();
    }

    @Transactional(readOnly = true)
    public MissionServiceRes getById(Long missionId, String email) {
        Mission mission = missionRepository.getById(missionId);

        mission.validateOwner(email);

        return MissionServiceRes.fromDomain(mission, today());
    }

    private Mission resume(Mission existing, MissionServiceStartReq request) {
        if (existing.isActive()) {
            throw new BaseException(ResultCode.MISSION_ALREADY_STARTED);
        }

        existing.changeGoal(request.target(), request.period());
        existing.resume();

        return existing;
    }

    private LocalDate today() {
        return LocalDate.now(clock);
    }
}
