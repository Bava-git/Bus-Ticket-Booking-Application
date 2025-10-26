package com.bluebus.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "passengerbookinginfodb")
public class PassengerBookingInfo {

    @Id
    @Column(name = "passengerBookingInfo_id")
    @JsonProperty("passengerBookingInfo_id")
    private String passengerBookingInfoId;

    @Column(name = "pnr_Number")
    @JsonProperty("pnr_Number")
    private String pnrNumber;

    @Column(name = "bookingInfo_id")
    @JsonProperty("bookingInfo_id")
    private String bookingInfoId;

    @Column(name = "booking_datetime")
    @JsonProperty("booking_datetime")
    private LocalDateTime bookingDateTime;

    @Column(name = "passenger_id")
    @JsonProperty("passenger_id")
    private String passengerId;

    @Column(name = "seat_num")
    @JsonProperty("seat_num")
    private String seatNum;

    @Column(name = "paymentType")
    @JsonProperty("paymentType")
    private String paymentType;

}
