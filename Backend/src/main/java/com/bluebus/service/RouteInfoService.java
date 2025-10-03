package com.bluebus.service;

import com.bluebus.entity.RouteInfo;
import com.bluebus.repository.RouteInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteInfoService {

    @Autowired
    private RouteInfoRepository routeInfoRepository;

    public List<RouteInfo> listRouteInfo() {
        return routeInfoRepository.findAll();
    }

    public RouteInfo findByRouteInfoId(String routeInfoId) {
        return routeInfoRepository.findByRouteInfoId(routeInfoId);
    }

    public RouteInfo createRouteInfo(RouteInfo routeInfo) {
        return routeInfoRepository.save(routeInfo);
    }

    public RouteInfo updateRouteInfo(String routeInfoId, RouteInfo updateRouteInfo) {
        RouteInfo existRouteInfo = routeInfoRepository.findByRouteInfoId(routeInfoId);

        if (existRouteInfo != null) {
            existRouteInfo.setOrigin(updateRouteInfo.getOrigin());
            existRouteInfo.setDistance(updateRouteInfo.getDistance());
            existRouteInfo.setDistance(updateRouteInfo.getDistance());
            existRouteInfo.setTravelTime(updateRouteInfo.getTravelTime());
            return routeInfoRepository.save(existRouteInfo);
        }

        return null;
    }

    public int deleteRouteInfo(String routeInfoId) {
        return routeInfoRepository.deleteByRouteInfoId(routeInfoId);
    }

}
