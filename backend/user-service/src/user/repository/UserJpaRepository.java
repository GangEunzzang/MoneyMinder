package com.moneyminder.domain.user.repository;

import com.moneyminder.domain.user.infrastructure.jpa.entity.UserEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserJpaRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByEmail(String email);

}