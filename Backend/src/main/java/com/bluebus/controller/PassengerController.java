package com.bluebus.controller;

import com.bluebus.entity.Passenger;
import com.bluebus.service.PassengerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/passenger")
@CrossOrigin("http://localhost:3000")
public class PassengerController {

    @Autowired
    private PassengerService passengerService;

    @GetMapping
    public List<Passenger> listPassenger() {
        return passengerService.listPassenger();
    }

    @GetMapping("/id/{passengerId}")
    public ResponseEntity<?> findByPassengerId(@PathVariable String passengerId) {
        Passenger passenger = passengerService.findByPassengerId(passengerId);
        if (passenger != null) {
            return ResponseEntity.ok(passenger); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Passenger not found, " + passengerId); // 404 NOT_FOUND
        }
    }

    @GetMapping("/email/{passengerEmail}")
    public ResponseEntity<?> findByPassengerEmail(@PathVariable String passengerEmail) {
        Passenger passenger = passengerService.findByPassengerEmail(passengerEmail);
        if (passenger != null) {
            return ResponseEntity.ok(passenger); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Passenger not found, " + passengerEmail); // 404 NOT_FOUND
        }
    }

    @GetMapping("/mobile/{passengerMobile}")
    public ResponseEntity<?> findByPassengerMobile(@PathVariable String passengerMobile) {
        Passenger passenger = passengerService.findByPassengerMobile(passengerMobile);
        if (passenger != null) {
            return ResponseEntity.ok(passenger); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Passenger not found, " + passengerMobile); // 404 NOT_FOUND
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> createPassenger(@RequestBody Passenger passenger) {

        Passenger isExist =
                passengerService.findByPassengerId(passenger.getPassengerId());
        isExist =
                passengerService.findByPassengerEmail(passenger.getPassengerEmail());
        isExist =
                passengerService.findByPassengerMobile(passenger.getPassengerMobile());
        if (isExist != null) {
            return ResponseEntity.status(HttpStatus.FOUND).body("Passenger ID/Email/Mobile already exist");
        }

        Passenger pass = passengerService.createPassenger(passenger);
        if (pass != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(pass);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @PutMapping("/update/{passengerId}")
    public ResponseEntity<?> updatePassenger(@PathVariable String passengerId, @RequestBody Passenger updatePassenger) {
        Passenger pat = passengerService.updatePassenger(passengerId, updatePassenger);
        if (pat != null) {
            return ResponseEntity.status(HttpStatus.OK).body("Updated successfully."); // 200 OK
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Passenger not found, " + passengerId); // 404 NOT_FOUND
    }

    @Transactional
    @DeleteMapping("/delete/{passengerId}")
    public ResponseEntity<?> deletePassenger(@PathVariable String passengerId) {
        int isDeleted = passengerService.deletePassenger(passengerId);
        if (isDeleted == 3) {
            return ResponseEntity.status(HttpStatus.OK).body("Deleted from all tables"); // 200 OK
        } else if (isDeleted > 0) {
            return ResponseEntity.status(HttpStatus.OK).body("Deleted successfully"); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Passenger not found, " + passengerId);
        }
    }


}
