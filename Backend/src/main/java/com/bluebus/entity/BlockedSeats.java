package com.bluebus.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "blockedseats")
public class BlockedSeats {

    @Id
    @Column(name = "busBookingInfo_id")
    @JsonProperty("busBookingInfo_id")
    private String busBookingInfoId;

    @Column(name = "bus_id")
    @JsonProperty("bus_id")
    private String busId;

    @Column(name = "bookedSeatNum")
    @JsonProperty("bookedSeatNum")
    private String bookedSeatNum;

    @Column(name = "booked_date")
    @JsonProperty("booked_date")
    private LocalDate bookingDate;

    @Column(name = "passenger_gender")
    @JsonProperty("passenger_gender")
    @NotBlank
    private String passengerGender;

}
