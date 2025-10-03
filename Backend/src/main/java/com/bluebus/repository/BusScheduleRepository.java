package com.bluebus.repository;

import com.bluebus.entity.BusSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusScheduleRepository extends JpaRepository<BusSchedule, Long> {
    BusSchedule findByBookingInfoId(String bookingInfoId);

    List<BusSchedule> findByBusId(String busId);

    List<BusSchedule> findByRouteInfoId(String routeInfoId);

    int deleteByBookingInfoId(String bookingInfoId);

    int deleteAllByBusId(String busId);

}
