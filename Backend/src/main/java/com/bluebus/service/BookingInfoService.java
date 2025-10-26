package com.bluebus.service;

import com.bluebus.entity.BookingInfo;
import com.bluebus.repository.BookingInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingInfoService {

    @Autowired
    private BookingInfoRepository bookingInfoRepository;

    public List<BookingInfo> listPBIR() {
        return bookingInfoRepository.findAll();
    }

    public BookingInfo findByBookingInfoId(String bookingInfoId) {
        return bookingInfoRepository.findByBookingInfoId(bookingInfoId);
    }

    public List<BookingInfo> findByBusId(String busId) {
        return bookingInfoRepository.findByBusId(busId);
    }

    public List<BookingInfo> findByRouteInfoId(String routeInfoId) {
        return bookingInfoRepository.findByRouteInfoId(routeInfoId);
    }

    public BookingInfo createBIR(BookingInfo bookingInfo) {
        return bookingInfoRepository.save(bookingInfo);
    }

    public int deleteBIR(String bookingInfoId) {
        return bookingInfoRepository.deleteByBookingInfoId(bookingInfoId);
    }

    public int deleteAllByBusId(String busId) {
        return bookingInfoRepository.deleteAllByBusId(busId);
    }

    public List<BookingInfo> findByRouteInfoIdandboardingDateTime(String routeInfoId, LocalDateTime boardingDateTime) {
        List<BookingInfo> busScheduleList = bookingInfoRepository.findAll();
        List<BookingInfo> filteredBusScheduleList = busScheduleList.stream().filter(item -> (
                item.getRouteInfoId().equals(routeInfoId)
//                        && item.getBoardingDateTime().equals(boardingDateTime)
                        && item.getBoardingDateTime().toLocalDate().equals(boardingDateTime.toLocalDate())
        )).collect(Collectors.toList());
        return filteredBusScheduleList;
    }
}
