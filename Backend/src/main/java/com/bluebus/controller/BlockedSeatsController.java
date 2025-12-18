package com.bluebus.controller;

import com.bluebus.entity.BlockedSeats;
import com.bluebus.service.BlockedSeatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/busbookinginfo")
@CrossOrigin("http://localhost:3000")
public class BlockedSeatsController {

    @Autowired
    private BlockedSeatsService blockedSeatsService;

    @GetMapping
    public List<BlockedSeats> listBBIR() {
        return blockedSeatsService.listBBIR();
    }

    @GetMapping("/id/{busBookingInfoId}")
    public ResponseEntity<?> findByBusBookingInfoId(@PathVariable String busBookingInfoId) {
        BlockedSeats busBookingInfo = blockedSeatsService.findByBusBookingInfoId(busBookingInfoId);
        if (busBookingInfo != null) {
            return ResponseEntity.ok(busBookingInfo); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("BusBookingInfo not found, " + busBookingInfoId); // 404 NOT_FOUND
        }
    }

    @GetMapping("/bus/{busId}")
    public ResponseEntity<?> findByBusId(@PathVariable String busId) {
        List<BlockedSeats> busBookingInfo = blockedSeatsService.findByBusId(busId);
        if (busBookingInfo != null && !busBookingInfo.isEmpty()) {
            return ResponseEntity.ok(busBookingInfo); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "BusBookingInfo not found", "busId", busId)); // 404 NOT_FOUND
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> createBIR(@RequestBody BlockedSeats busBookingInfo) {

        BlockedSeats isExist = blockedSeatsService.findByBusBookingInfoId(busBookingInfo.getBusBookingInfoId());
        if (isExist != null) {
            return ResponseEntity.status(HttpStatus.FOUND).body("ID already exist " + busBookingInfo.getBusBookingInfoId());
        }

        BlockedSeats bir = blockedSeatsService.createBBIR(busBookingInfo);
        if (bir != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(bir);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @PostMapping("/add/all")
    public ResponseEntity<?> multipleBSRcreate(@RequestBody List<BlockedSeats> blockedSeats) {

        for (BlockedSeats element : blockedSeats) {
            BlockedSeats isExist =
                    blockedSeatsService.findByBusBookingInfoId(element.getBusBookingInfoId());
            if (isExist != null) {
                return ResponseEntity.status(HttpStatus.FOUND).body("ID already exist " +
                        element.getBusBookingInfoId());
            }
        }

        List<BlockedSeats> pass = blockedSeatsService.multipleBSRcreate(blockedSeats);
        if (pass != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(pass);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @PutMapping("/update/{bookingInfoId}")
    public ResponseEntity<?> updateBIR(@PathVariable String bookingInfoId, @RequestBody BlockedSeats updateBookingInfo) {
        BlockedSeats bookingInfo = blockedSeatsService.updateBBIR(bookingInfoId, updateBookingInfo);
        System.out.println(bookingInfo);
        if (bookingInfo != null) {
            return ResponseEntity.status(HttpStatus.OK).body("Updated successfully."); // 200 OK
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("BusBookingInfo not found, " + bookingInfoId); // 404 NOT_FOUND
    }

    @Transactional
    @DeleteMapping("/delete/{busBookingInfo}")
    public ResponseEntity<?> deleteByBusBookingInfoId(@PathVariable String busBookingInfo) {
        int isDeleted = blockedSeatsService.deleteByBusBookingInfoId(busBookingInfo);
        if (isDeleted > 0) {
            return ResponseEntity.status(HttpStatus.OK).body("Deleted successfully"); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("BusBookingInfo not found, " + busBookingInfo); // 404 NOT_FOUND
        }
    }
}
