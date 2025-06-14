package com.captoneprojec.repository;

import com.captoneprojec.entity.Bus;
import com.captoneprojec.entity.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    Bus findByBusId(String busId);

    int deleteByBusId(String busId);
}
