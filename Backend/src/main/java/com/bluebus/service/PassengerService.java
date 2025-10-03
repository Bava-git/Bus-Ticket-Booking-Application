package com.bluebus.service;

import com.bluebus.entity.Passenger;
import com.bluebus.repository.PassengerBookingInfoRep;
import com.bluebus.repository.UserRepository;
import com.bluebus.repository.PassengerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PassengerService {

    @Autowired
    private PassengerRepository passengerRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PassengerBookingInfoRep passengerBookingInfoRep;

    public List<Passenger> listPassenger() {
        return passengerRepository.findAll();
    }

    public Passenger findByPassengerId(String passengerId) {
        return passengerRepository.findByPassengerId(passengerId);
    }

    public Passenger findByPassengerEmail(String passengerEmail) {
        return passengerRepository.findByPassengerEmail(passengerEmail);
    }

    public Passenger findByPassengerMobile(String passengerMobile) {
        return passengerRepository.findByPassengerMobile(passengerMobile);
    }

    public Passenger createPassenger(Passenger passenger) {
        return passengerRepository.save(passenger);
    }

    public Passenger updatePassenger(String passengerId, Passenger updatePassenger) {
        Passenger existPassenger = passengerRepository.findByPassengerId(passengerId);
        System.out.println(existPassenger);
        if (existPassenger != null) {
            existPassenger.setPassengerName(updatePassenger.getPassengerName());
            existPassenger.setPassengerDOB(updatePassenger.getPassengerDOB());
            existPassenger.setPassengerEmail(updatePassenger.getPassengerEmail());
            existPassenger.setPassengerMobile(updatePassenger.getPassengerMobile());
            existPassenger.setPassengerGender(updatePassenger.getPassengerGender());
            return passengerRepository.save(existPassenger);
        }

        return null;
    }

    public int deletePassenger(String passengerId) {
        int i = 0;
        i = i + userRepository.deleteByPassengerId(passengerId);
        i = i + passengerBookingInfoRep.deleteAllByPassengerId(passengerId);
        i = i + passengerRepository.deleteByPassengerId(passengerId);
        return i;
    }

}
