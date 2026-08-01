package com.moneyminder.domain.mission.presentation;

import com.moneyminder.domain.mission.application.MissionService;
import com.moneyminder.domain.mission.application.dto.response.MissionServiceRes;
import com.moneyminder.domain.mission.presentation.dto.MissionStartReq;
import com.moneyminder.domain.mission.presentation.dto.MissionUpdateReq;
import com.moneyminder.global.annotation.CurrentUserEmail;
import com.moneyminder.global.response.DataResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/missions")
@RestController
public class MissionController {

    private final MissionService missionService;

    @PostMapping
    public DataResponse<MissionServiceRes> start(@CurrentUserEmail String email,
            @Valid @RequestBody MissionStartReq request) {
        return DataResponse.of(missionService.start(request.toService(email)));
    }

    @PutMapping("/{missionId}")
    public DataResponse<MissionServiceRes> update(@CurrentUserEmail String email, @PathVariable Long missionId,
            @Valid @RequestBody MissionUpdateReq request) {
        return DataResponse.of(missionService.update(request.toService(missionId, email)));
    }

    /**
     * 미션은 지우지 않고 멈춘다. 지우면 다시 시작할 때 시작일과 이력이 사라진다.
     */
    @DeleteMapping("/{missionId}")
    public DataResponse<Void> stop(@CurrentUserEmail String email, @PathVariable Long missionId) {
        missionService.stop(missionId, email);

        return DataResponse.empty();
    }

    @GetMapping("/{missionId}")
    public DataResponse<MissionServiceRes> getById(@CurrentUserEmail String email, @PathVariable Long missionId) {
        return DataResponse.of(missionService.getById(missionId, email));
    }

    @GetMapping
    public DataResponse<List<MissionServiceRes>> getMine(@CurrentUserEmail String email) {
        return DataResponse.of(missionService.getByUserEmail(email));
    }
}
