package com.bluebus.service;

import com.bluebus.entity.Bus;
import com.bluebus.repository.BlockedSeatsRepository;
import com.bluebus.repository.BusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BusService {

    @Autowired
    private BusRepository busRepository;
    @Autowired
    private BlockedSeatsRepository busBookingInfoRepository;
    @Autowired
    private BusScheduleService bookingInfoService;

    public List<Bus> listBus() {
        return busRepository.findAll();
    }

    public Bus findByBusId(String busId) {
        return busRepository.findByBusId(busId);
    }

    public Bus createBus(Bus bus) {
        return busRepository.save(bus);
    }

    public Bus updateBus(String busId, Bus updateBus) {
        Bus existBus = busRepository.findByBusId(busId);

        if (existBus != null) {
            existBus.setBusName(updateBus.getBusName());
            existBus.setRatePerKm(updateBus.getRatePerKm());
            existBus.setLowerLeft(updateBus.getLowerLeft());
            existBus.setLowerRight(updateBus.getLowerRight());
            existBus.setUpperDeck(updateBus.isUpperDeck());
            existBus.setNumOfSeaterSeats(updateBus.getNumOfSeaterSeats());
            existBus.setNumOfSleeperSeats(updateBus.getNumOfSleeperSeats());
            existBus.setACBus(updateBus.isACBus());
            existBus.setWaterBottle(updateBus.isWaterBottle());
            existBus.setBlanket(updateBus.isBlanket());
            existBus.setChargingPoint(updateBus.isChargingPoint());
            return busRepository.save(updateBus);
        }

        return null;
    }

    public int deleteBus(String busId) {
        int i = 0;
        i = i + bookingInfoService.deleteAllByBusId(busId);
        i = i + busBookingInfoRepository.deleteAllByBusId(busId);
        i = i + busRepository.deleteByBusId(busId);
        return i;
    }

}
