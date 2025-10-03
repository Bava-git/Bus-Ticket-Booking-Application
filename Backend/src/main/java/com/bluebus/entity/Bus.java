package com.bluebus.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "busdb")
public class Bus {

    @Id
    @Column(name = "bus_id")
    @JsonProperty("bus_id")
    private String busId;

    @Column(name = "bus_name")
    @JsonProperty("bus_name")
    @NotBlank
    private String busName;

    @Column(name = "ratePerKm")
    @JsonProperty("ratePerKm")
    private double ratePerKm;

    @Column(name = "isUpperDeck")
    @JsonProperty("isUpperDeck")
    private boolean isUpperDeck;

    @Column(name = "lower_left")
    @JsonProperty("lower_left")
    private String lowerLeft;

    @Column(name = "lower_right")
    @JsonProperty("lower_right")
    private String lowerRight;

    @Column(name = "numOfSeaterSeats")
    @JsonProperty("numOfSeaterSeats")
    private int numOfSeaterSeats;

    @Column(name = "numOfSleeperSeats")
    @JsonProperty("numOfSleeperSeats")
    private int numOfSleeperSeats;

    @Column(name = "isACBus")
    @JsonProperty("isACBus")
    private boolean isACBus;

    @Column(name = "waterBottle")
    @JsonProperty("waterBottle")
    private boolean waterBottle;

    @Column(name = "blanket")
    @JsonProperty("blanket")
    private boolean blanket;

    @Column(name = "chargingPoint")
    @JsonProperty("chargingPoint")
    private boolean chargingPoint;

}
