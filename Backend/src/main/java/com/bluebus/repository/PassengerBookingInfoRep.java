package com.bluebus.repository;

import com.bluebus.entity.PassengerBookingInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PassengerBookingInfoRep extends JpaRepository<PassengerBookingInfo, Long> {
    PassengerBookingInfo findByPassengerBookingInfoId(String passengerBookingInfoId);

    List<PassengerBookingInfo> findByPassengerId(String passengerId);

    int deleteByPassengerBookingInfoId(String passengerBookingInfoId);

    int deleteAllByPassengerId(String passengerId);
}
