package com.captoneprojec.service;

import com.captoneprojec.entity.BusSchedule;
import com.captoneprojec.repository.BusScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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

    public List<BusSchedule> findByRouteInfoIdandboardingDateTime(String routeInfoId, LocalDateTime boardingDateTime) {
        List<BusSchedule> busScheduleList = bookingInfoRepository.findAll();
        List<BusSchedule> filteredBusScheduleList = busScheduleList.stream().filter(item -> (
                item.getRouteInfoId().equals(routeInfoId)
//                        && item.getBoardingDateTime().equals(boardingDateTime)
                        && item.getBoardingDateTime().toLocalDate().equals(boardingDateTime.toLocalDate())
        )).collect(Collectors.toList());
        return filteredBusScheduleList;
    }
}
