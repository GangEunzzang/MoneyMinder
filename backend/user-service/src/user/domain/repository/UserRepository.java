package com.moneyminder.domain.user.domain.repository;

import com.moneyminder.domain.user.domain.User;
import java.util.Optional;

public interface UserRepository {

    User save(User user);

    User getById(Long id);

    Optional<User> findById(Long id);

    Optional<User> findByEmail(String email);

    void delete(User user);

    void deleteAllInBatch();
}
