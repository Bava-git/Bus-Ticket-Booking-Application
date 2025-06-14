package com.captoneprojec.service;

import com.captoneprojec.entity.PassengerBookingInfo;
import com.captoneprojec.repository.PassengerBookingInfoRep;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PassengerBookingInfoService {

    @Autowired
    private PassengerBookingInfoRep passengerBookInfoRep;

    public List<PassengerBookingInfo> multiplePBIRcreate(List<PassengerBookingInfo> passengerBookingInfo) {
        return passengerBookInfoRep.saveAll(passengerBookingInfo);
    }

    public List<PassengerBookingInfo> listPBIR() {
        return passengerBookInfoRep.findAll();
    }

    public List<PassengerBookingInfo> findByPassengerId(String passengerId) {
        return passengerBookInfoRep.findByPassengerId(passengerId);
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
            ifExist.setBookingInfoId(UpdatepassengerBookingInfo.getBookingInfoId());
            ifExist.setPassengerEmail(UpdatepassengerBookingInfo.getPassengerEmail());
            ifExist.setPassengerName(UpdatepassengerBookingInfo.getPassengerName());
            ifExist.setPassengerMobile(UpdatepassengerBookingInfo.getPassengerMobile());
            ifExist.setSeatNum(UpdatepassengerBookingInfo.getSeatNum());
            ifExist.setPassengerId(UpdatepassengerBookingInfo.getPassengerId());
            ifExist.setPaymentType(UpdatepassengerBookingInfo.getPaymentType());
            ifExist.setPassengerGender(UpdatepassengerBookingInfo.getPassengerGender());
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
