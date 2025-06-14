package com.captoneprojec.repository;

import com.captoneprojec.entity.Bus;
import com.captoneprojec.entity.RouteInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RouteInfoRepository extends JpaRepository<RouteInfo, Long> {
    RouteInfo findByRouteInfoId(String routeInfoId);

    int deleteByRouteInfoId(String routeInfoId);
}
