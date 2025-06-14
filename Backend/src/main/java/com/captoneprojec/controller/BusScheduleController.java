package com.captoneprojec.controller;

import com.captoneprojec.entity.BusSchedule;
import com.captoneprojec.service.BusScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookinginfo")
@CrossOrigin("http://localhost:3000")
public class BusScheduleController {

    @Autowired
    private BusScheduleService bookingInfoSer;

    @GetMapping
    public List<BusSchedule> listPBIR() {
        return bookingInfoSer.listPBIR();
    }

    @GetMapping("/id/{bookingInfoId}")
    public ResponseEntity<?> findByBookingInfoId(@PathVariable String bookingInfoId) {
        BusSchedule bookingInfo = bookingInfoSer.findByBookingInfoId(bookingInfoId);
        if (bookingInfo != null) {
            return ResponseEntity.ok(bookingInfo); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("BookingInfo not found, " + bookingInfoId); // 404 NOT_FOUND
        }
    }

    @GetMapping("/bus/{busId}")
    public ResponseEntity<?> findByBusId(@PathVariable String busId) {
        List<BusSchedule> bookingInfoList = bookingInfoSer.findByBusId(busId);
        if (bookingInfoList != null && !bookingInfoList.isEmpty()) {
            return ResponseEntity.ok(bookingInfoList); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "BookingInfo not found", "busId", busId)); // 404 NOT_FOUND
        }
    }

    @GetMapping("/route/{routeInfoId}")
    public ResponseEntity<?> findByRouteInfoId(@PathVariable String routeInfoId) {
        List<BusSchedule> bookingInfoList = bookingInfoSer.findByRouteInfoId(routeInfoId);
        if (bookingInfoList != null && !bookingInfoList.isEmpty()) {
            return ResponseEntity.ok(bookingInfoList); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "BookingInfo not found", "routeInfoId", routeInfoId)); // 404 NOT_FOUND
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> createBIR(@RequestBody BusSchedule bookingInfo) {

        BusSchedule isExist = bookingInfoSer.findByBookingInfoId(bookingInfo.getBookingInfoId());
        if (isExist != null) {
            return ResponseEntity.status(HttpStatus.FOUND).body("ID already exist " + bookingInfo.getBookingInfoId());
        }

        BusSchedule bir = bookingInfoSer.createBIR(bookingInfo);
        if (bir != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(bir);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @Transactional
    @DeleteMapping("/delete/{bookingInfoId}")
    public ResponseEntity<?> deleteBIR(@PathVariable String bookingInfoId) {
        int isDeleted = bookingInfoSer.deleteBIR(bookingInfoId);
        if (isDeleted > 0) {
            return ResponseEntity.status(HttpStatus.OK).body("Deleted successfully"); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("BookingInfo not found, " + bookingInfoId); // 404 NOT_FOUND
        }
    }


}
