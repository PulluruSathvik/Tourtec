package com.tourtec.repository;

import com.tourtec.entity.UserBookingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserBookingRepository extends JpaRepository<UserBookingEntity, Long> {
    List<UserBookingEntity> findByUserId(Long userId);
}
