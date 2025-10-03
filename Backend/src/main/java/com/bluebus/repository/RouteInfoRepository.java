package com.bluebus.repository;

import com.bluebus.entity.RouteInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RouteInfoRepository extends JpaRepository<RouteInfo, Long> {
    RouteInfo findByRouteInfoId(String routeInfoId);

    int deleteByRouteInfoId(String routeInfoId);
}
