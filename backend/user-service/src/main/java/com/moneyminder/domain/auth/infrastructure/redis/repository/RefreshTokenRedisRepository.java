package com.moneyminder.domain.auth.infrastructure.redis.repository;

import com.moneyminder.domain.auth.infrastructure.redis.entity.RefreshTokenRedis;
import org.springframework.data.repository.CrudRepository;

public interface RefreshTokenRedisRepository extends CrudRepository<RefreshTokenRedis, String> {

}
