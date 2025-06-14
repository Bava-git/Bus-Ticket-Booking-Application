package com.captoneprojec.service;

import com.captoneprojec.entity.BusSchedule;
import com.captoneprojec.repository.BusScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BusScheduleService {

    @Autowired
    private BusScheduleRepository bookingInfoRepository;

    public List<BusSchedule> listPBIR() {
        return bookingInfoRepository.findAll();
    }

    public BusSchedule findByBookingInfoId(String bookingInfoId) {
        return bookingInfoRepository.findByBookingInfoId(bookingInfoId);
    }

    public List<BusSchedule> findByBusId(String busId) {
        return bookingInfoRepository.findByBusId(busId);
    }

    public List<BusSchedule> findByRouteInfoId(String routeInfoId) {
        return bookingInfoRepository.findByRouteInfoId(routeInfoId);
    }

    public BusSchedule createBIR(BusSchedule bookingInfo) {
        return bookingInfoRepository.save(bookingInfo);
    }

    public int deleteBIR(String bookingInfoId) {
        return bookingInfoRepository.deleteByBookingInfoId(bookingInfoId);
    }

    public int deleteAllByBusId(String busId) {
        return bookingInfoRepository.deleteAllByBusId(busId);
    }
}
