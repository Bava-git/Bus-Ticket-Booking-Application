package com.captoneprojec.controller;

import com.captoneprojec.entity.Bus;
import com.captoneprojec.entity.PassengerBookingInfo;
import com.captoneprojec.service.BusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bus")
@CrossOrigin("http://localhost:3000")
public class BusController {

    @Autowired
    private BusService busService;

    @GetMapping
    public List<Bus> listBus() {
        return busService.listBus();
    }

    @GetMapping("/id/{busId}")
    public ResponseEntity<?> findByBusId(@PathVariable String busId) {
        Bus bus = busService.findByBusId(busId);
        if (bus != null) {
            return ResponseEntity.ok(bus); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Bus not found, " + busId); // 404 NOT_FOUND
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> createBus(@RequestBody Bus bus) {

        Bus isExist = busService.findByBusId(bus.getBusId());
        if (isExist != null) {
            return ResponseEntity.status(HttpStatus.FOUND).body("ID already exist " + bus.getBusId());
        }

        Bus NewBus = busService.createBus(bus);
        if (NewBus != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(NewBus);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @PutMapping("/update/{busId}")
    public ResponseEntity<?> updateBus(@PathVariable String busId, @RequestBody Bus updateBus) {
        Bus bus = busService.updateBus(busId, updateBus);
        if (bus != null) {
            return ResponseEntity.status(HttpStatus.OK).body("Updated successfully."); // 200 OK
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Bus not found, " + busId); // 404 NOT_FOUND
    }

    @Transactional
    @DeleteMapping("/delete/{busId}")
    public ResponseEntity<?> deleteBus(@PathVariable String busId) {
        int isDeleted = busService.deleteBus(busId);

        if (isDeleted == 3) {
            return ResponseEntity.status(HttpStatus.OK).body("Deleted from all tables"); // 200 OK
        } else if (isDeleted > 0) {
            return ResponseEntity.status(HttpStatus.OK).body("Deleted successfully"); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Bus not found, " + busId); // 404 NOT_FOUND
        }
    }


}
