package com.bluebus.repository;

import com.bluebus.entity.BlockedSeats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlockedSeatsRepository extends JpaRepository<BlockedSeats, Long> {

    BlockedSeats findByBusBookingInfoId(String busBookingInfoId);

    List<BlockedSeats> findByBusId(String busId);

    int deleteAllByBusId(String busId);

    int deleteByBusBookingInfoId(String busBookingInfoId);
}
