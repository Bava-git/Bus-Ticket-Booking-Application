package com.bluebus.repository;

import com.bluebus.entity.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PassengerRepository extends JpaRepository<Passenger, Long> {
    Passenger findByPassengerId(String passengerId);

    Passenger findByPassengerEmail(String passengerEmail);

    Passenger findByPassengerMobile(String passengerMobile);

    int deleteByPassengerId(String passengerId);
}
