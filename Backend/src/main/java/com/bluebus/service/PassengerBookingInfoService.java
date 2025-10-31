package com.bluebus.service;

import com.bluebus.dto.BusSeatType;
import com.bluebus.dto.ResTicketDwld;
import com.bluebus.entity.Bus;
import com.bluebus.entity.PassengerBookingInfo;
import com.bluebus.repository.PassengerBookingInfoRep;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PassengerBookingInfoService {

    @Autowired
    private PassengerBookingInfoRep passengerBookInfoRep;
    @Autowired
    private PassengerService passengerService;
    @Autowired
    private BookingInfoService busScheduleService;
    @Autowired
    private BusService busService;

    public List<PassengerBookingInfo> multiplePBIRcreate(List<PassengerBookingInfo> passengerBookingInfo) {
        return passengerBookInfoRep.saveAll(passengerBookingInfo);
    }

    public List<PassengerBookingInfo> listPBIR() {
        return passengerBookInfoRep.findAll();
    }

    public List<PassengerBookingInfo> findByPassengerId(String passengerId) {
        return passengerBookInfoRep.findByPassengerId(passengerId);
    }

    public List<PassengerBookingInfo> findByPnrNumber(String pnrNumber) {
        return passengerBookInfoRep.findByPnrNumber(pnrNumber);
    }

    public ResTicketDwld getByPassengerBookingInfoId(String pnrNumber) {

        if (!pnrNumber.isEmpty()) {
            ResTicketDwld resTicketDwld = new ResTicketDwld();
            resTicketDwld.setPassengerBookingInfo(passengerBookInfoRep.findByPnrNumber(pnrNumber));
            resTicketDwld.setPassenger(passengerService.findByPassengerId(resTicketDwld.getPassengerBookingInfo().get(0).getPassengerId()));
            resTicketDwld.setBusSchedule(busScheduleService.findByBookingInfoId(resTicketDwld.getPassengerBookingInfo().get(0).getBookingInfoId()));

            Bus bus = busService.findByBusId(resTicketDwld.getBusSchedule().getBusId());

            List<BusSeatType> busSeatTypes = new ArrayList<>();
            for (int i = 0; i < resTicketDwld.getPassengerBookingInfo().size(); i++) {

                String seatNumber = resTicketDwld.getPassengerBookingInfo().get(i).getSeatNum();
                switch (seatNumber.substring(0, 2)) {
                    case "LL" -> busSeatTypes.add(i, new BusSeatType(seatNumber, bus.getLowerLeft()));
                    case "LR" -> busSeatTypes.add(i, new BusSeatType(seatNumber, bus.getLowerRight()));
                    case "UL", "UR" -> busSeatTypes.add(i, new BusSeatType(seatNumber, "Sleeper"));
                    default -> busSeatTypes.add(i, new BusSeatType(seatNumber, "Check with operator"));
                }
            }
            resTicketDwld.setBusSeatType(busSeatTypes);

            return resTicketDwld;
        }
        return null;
    }

    public PassengerBookingInfo findByPassengerBookingInfoId(String passengerBookingInfoId) {
        return passengerBookInfoRep.findByPassengerBookingInfoId(passengerBookingInfoId);
    }

    public PassengerBookingInfo createPBIR(PassengerBookingInfo passengerBookingInfo) {
        return passengerBookInfoRep.save(passengerBookingInfo);
    }

    public PassengerBookingInfo updatePBIR(String passengerBookingInfoId,
                                           PassengerBookingInfo UpdatepassengerBookingInfo) {
        PassengerBookingInfo ifExist = passengerBookInfoRep.
                findByPassengerBookingInfoId(passengerBookingInfoId);

        if (ifExist != null) {
            ifExist.setPassengerBookingInfoId(UpdatepassengerBookingInfo.getPassengerBookingInfoId());
            ifExist.setSeatNum(UpdatepassengerBookingInfo.getSeatNum());
            ifExist.setPaymentType(UpdatepassengerBookingInfo.getPaymentType());
            ifExist.setBookingDateTime(UpdatepassengerBookingInfo.getBookingDateTime());
            ifExist.setPnrNumber(UpdatepassengerBookingInfo.getPnrNumber());
            return passengerBookInfoRep.save(UpdatepassengerBookingInfo);
        }

        return null;
    }

    public int deletePBIR(String passengerBookingInfoId) {
        return passengerBookInfoRep.deleteByPassengerBookingInfoId(passengerBookingInfoId);
    }
}
