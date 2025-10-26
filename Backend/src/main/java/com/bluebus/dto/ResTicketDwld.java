package com.bluebus.dto;

import com.bluebus.entity.BookingInfo;
import com.bluebus.entity.Passenger;
import com.bluebus.entity.PassengerBookingInfo;
import lombok.Data;

import java.util.List;

@Data
public class ResTicketDwld {

    private Passenger passenger;
    private List<PassengerBookingInfo> passengerBookingInfo;
    private BookingInfo busSchedule;
    private String busSeatType;

}
