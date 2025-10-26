package com.bluebus.controller;

import com.bluebus.entity.BookingInfo;
import com.bluebus.service.BookingInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookinginfo")
@CrossOrigin("http://localhost:3000")
public class BookingInfoController {

    @Autowired
    private BookingInfoService busScheduleService;

    @GetMapping
    public List<BookingInfo> listPBIR() {
        return busScheduleService.listPBIR();
    }

    @GetMapping("/id/{bookingInfoId}")
    public ResponseEntity<?> findByBookingInfoId(@PathVariable String bookingInfoId) {
        BookingInfo bookingInfo = busScheduleService.findByBookingInfoId(bookingInfoId);
        if (bookingInfo != null) {
            return ResponseEntity.ok(bookingInfo); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("BookingInfo not found, " + bookingInfoId); // 404 NOT_FOUND
        }
    }

    @GetMapping("/bus/{busId}")
    public ResponseEntity<?> findByBusId(@PathVariable String busId) {
        List<BookingInfo> bookingInfoList = busScheduleService.findByBusId(busId);
        if (bookingInfoList != null && !bookingInfoList.isEmpty()) {
            return ResponseEntity.ok(bookingInfoList); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "BookingInfo not found", "busId", busId)); // 404 NOT_FOUND
        }
    }

    @GetMapping("/route/{routeInfoId}")
    public ResponseEntity<?> findByRouteInfoId(@PathVariable String routeInfoId) {
        List<BookingInfo> bookingInfoList = busScheduleService.findByRouteInfoId(routeInfoId);
        if (bookingInfoList != null && !bookingInfoList.isEmpty()) {
            return ResponseEntity.ok(bookingInfoList); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "BookingInfo not found", "routeInfoId", routeInfoId)); // 404 NOT_FOUND
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> createBIR(@RequestBody BookingInfo bookingInfo) {

        BookingInfo isExist = busScheduleService.findByBookingInfoId(bookingInfo.getBookingInfoId());
        if (isExist != null) {
            return ResponseEntity.status(HttpStatus.FOUND).body("ID already exist " + bookingInfo.getBookingInfoId());
        }

        BookingInfo bir = busScheduleService.createBIR(bookingInfo);
        if (bir != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(bir);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @Transactional
    @DeleteMapping("/delete/{bookingInfoId}")
    public ResponseEntity<?> deleteBIR(@PathVariable String bookingInfoId) {
        int isDeleted = busScheduleService.deleteBIR(bookingInfoId);
        if (isDeleted > 0) {
            return ResponseEntity.status(HttpStatus.OK).body("Deleted successfully"); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("BookingInfo not found, " + bookingInfoId); // 404 NOT_FOUND
        }
    }

    @GetMapping("/getroutes")
    public ResponseEntity<?> findByRouteInfoIdandboardingDateTime(
            @RequestParam String routeInfoId, @RequestParam LocalDateTime boardingDateTime) {
        List<BookingInfo> busScheduleList = busScheduleService.findByRouteInfoIdandboardingDateTime(
                routeInfoId, boardingDateTime);
        if (busScheduleList != null) {
            return ResponseEntity.ok(busScheduleList); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body
                    ("BookingInfo not found, " + routeInfoId + " " + boardingDateTime); // 404 NOT_FOUND
        }
    }

}
