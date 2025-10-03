package com.bluebus.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long Id;

    @JsonProperty("passenger_id")
    @Column(name = "passenger_id", insertable = false, updatable = false)
    private String passengerId;

    @OneToOne
    @JoinColumn(name = "passenger_id", referencedColumnName = "passenger_id")
    private Passenger passenger;

    @Column(name = "username")
    @JsonProperty("username")
    @NotBlank
    @Size(min = 3, max = 255)
    private String username;

    @Column(name = "password")
    @JsonProperty("password")
    @NotBlank
    @Size(min = 4, max = 255)
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "users_roles", joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"))
    private List<Role> roles = new ArrayList<>();
}
