package com.captoneprojec.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
@Table(name = "passengerdb")
public class Passenger {

    @Id
    @Column(name = "passenger_id")
    @JsonProperty("passenger_id")
    private String passengerId;

    @Column(name = "passenger_name")
    @JsonProperty("passenger_name")
    @NotBlank
    @Size(min = 3, max = 30)
    private String passengerName;

    @Column(name = "passenger_dob")
    @JsonProperty("passenger_dob")
    private LocalDate passengerDOB;

    @Column(name = "passenger_gender")
    @JsonProperty("passenger_gender")
    @NotBlank
    private String passengerGender;

    @Column(name = "passenger_mobile")
    @JsonProperty("passenger_mobile")
    @NotBlank
    private String passengerMobile;

    @Column(name = "passenger_email")
    @JsonProperty("passenger_email")
    @NotBlank
    @Email
    private String passengerEmail;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;
}
