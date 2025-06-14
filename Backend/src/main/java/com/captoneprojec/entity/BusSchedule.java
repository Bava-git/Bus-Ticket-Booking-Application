package com.captoneprojec.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "busschedule")
public class BusSchedule {

    @Id
    @Column(name = "bookingInfo_id")
    @JsonProperty("bookingInfo_id")
    private String bookingInfoId;

    @Column(name = "bus_id")
    @JsonProperty("bus_id")
    private String busId;

    @Column(name = "bus_name")
    @JsonProperty("bus_name")
    @NotBlank
    private String busName;

    @Column(name = "availableSeaterSeats")
    @JsonProperty("availableSeaterSeats")
    private int availableSeaterSeats;

    @Column(name = "availableSleeperSeats")
    @JsonProperty("availableSleeperSeats")
    private int availableSleeperSeats;

    @Column(name = "routeInfo_id")
    @JsonProperty("routeInfo_id")
    private String routeInfoId;

    @Column(name = "boardingDateTime")
    @JsonProperty("boardingDateTime")
    private LocalDateTime boardingDateTime;

    @Column(name = "droppingDateTime")
    @JsonProperty("droppingDateTime")
    private LocalDateTime droppingDateTime;

    @Column(name = "travelTime")
    @JsonProperty("travelTime")
    private LocalTime travelTime;

    @Column(name = "origin")
    @JsonProperty("origin")
    private String origin;

    @Column(name = "destination")
    @JsonProperty("destination")
    @NotBlank
    private String destination;

    @Column(name = "total_distance")
    @JsonProperty("total_distance")
    private int totalDistance;

}
