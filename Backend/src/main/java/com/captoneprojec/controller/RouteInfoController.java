package com.captoneprojec.controller;

import com.captoneprojec.entity.Passenger;
import com.captoneprojec.entity.RouteInfo;
import com.captoneprojec.entity.RouteInfo;
import com.captoneprojec.service.RouteInfoService;
import com.captoneprojec.service.RouteInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/routes")
@CrossOrigin("http://localhost:3000")
public class RouteInfoController {

    @Autowired
    private RouteInfoService routeInfoService;

    @GetMapping
    public List<RouteInfo> listRouteInfo() {
        return routeInfoService.listRouteInfo();
    }

    @GetMapping("/id/{routeInfoId}")
    public ResponseEntity<?> findByRouteInfoId(@PathVariable String routeInfoId) {
        RouteInfo routeInfo = routeInfoService.findByRouteInfoId(routeInfoId);
        if (routeInfo != null) {
            return ResponseEntity.ok(routeInfo); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("RouteInfo not found, " + routeInfoId); // 404 NOT_FOUND
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> createRouteInfo(@RequestBody RouteInfo routeInfo) {

        RouteInfo isExist =
                routeInfoService.findByRouteInfoId(routeInfo.getRouteInfoId());
        if (isExist != null) {
            return ResponseEntity.status(HttpStatus.FOUND).body("ID already exist " +
                    routeInfo.getRouteInfoId());
        }

        RouteInfo route = routeInfoService.createRouteInfo(routeInfo);
        if (route != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(route);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @PutMapping("/update/{routeInfoId}")
    public ResponseEntity<?> updateRouteInfo(@PathVariable String routeInfoId, @RequestBody RouteInfo updateRouteInfo) {
        RouteInfo route = routeInfoService.updateRouteInfo(routeInfoId, updateRouteInfo);
        if (route != null) {
            return ResponseEntity.status(HttpStatus.OK).body("Updated successfully."); // 200 OK
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("RouteInfo not found, " + routeInfoId); // 404 NOT_FOUND
    }

    @Transactional
    @DeleteMapping("/delete/{routeInfoId}")
    public ResponseEntity<?> deleteRouteInfo(@PathVariable String routeInfoId) {
        int isDeleted = routeInfoService.deleteRouteInfo(routeInfoId);
        if (isDeleted > 0) {
            return ResponseEntity.status(HttpStatus.OK).body("Deleted successfully"); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("RouteInfo not found, " + routeInfoId); // 404 NOT_FOUND
        }
    }


}
