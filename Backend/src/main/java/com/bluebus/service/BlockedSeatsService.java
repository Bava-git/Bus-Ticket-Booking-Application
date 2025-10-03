package com.bluebus.service;

import com.bluebus.entity.BlockedSeats;
import com.bluebus.repository.BlockedSeatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BlockedSeatsService {

    @Autowired
    private BlockedSeatsRepository bookingInfoRepository;

    public List<BlockedSeats> listBBIR() {
        return bookingInfoRepository.findAll();
    }

    public BlockedSeats findByBusBookingInfoId(String busId) {
        return bookingInfoRepository.findByBusBookingInfoId(busId);
    }

    public List<BlockedSeats> findByBusId(String busId) {
        return bookingInfoRepository.findByBusId(busId);
    }

    public BlockedSeats createBBIR(BlockedSeats busBookingInfo) {
        return bookingInfoRepository.save(busBookingInfo);
    }

    public List<BlockedSeats> multipleBSRcreate(List<BlockedSeats> busBookingInfo) {
        return bookingInfoRepository.saveAll(busBookingInfo);
    }

    public BlockedSeats updateBBIR(String busId, BlockedSeats updatebusBookingInfo) {
        BlockedSeats existBus = bookingInfoRepository.findByBusBookingInfoId(busId);

        if (existBus != null) {
            existBus.setBusBookingInfoId((updatebusBookingInfo.getBusBookingInfoId()));
            existBus.setBusId(updatebusBookingInfo.getBusId());
            existBus.setBookingDate(updatebusBookingInfo.getBookingDate());
            existBus.setPassengerGender(updatebusBookingInfo.getPassengerGender());
            existBus.setBookedSeatNum(updatebusBookingInfo.getBookedSeatNum());
            return bookingInfoRepository.save(updatebusBookingInfo);
        }

        return null;
    }

    public int deleteAllByBusId(String busId) {
        return bookingInfoRepository.deleteAllByBusId(busId);
    }

    public int deleteByBusBookingInfoId(String BusBookingInfoId) {
        return bookingInfoRepository.deleteByBusBookingInfoId(BusBookingInfoId);
    }

}
