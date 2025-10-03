package com.bluebus.serviceTest;

import com.bluebus.entity.RouteInfo;
import com.bluebus.repository.RouteInfoRepository;
import com.bluebus.service.RouteInfoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RouteInfoTest {

    @Mock
    private RouteInfoRepository routeInfoRepository;

    @InjectMocks
    private RouteInfoService routeInfoService;

    private RouteInfo routeInfo1;
    private RouteInfo routeInfo2;

    @BeforeEach
    void setup() {
        routeInfo1 = new RouteInfo("RI1", "Tirunelveli", "Chennai", 635, LocalTime.of(10, 0));
        routeInfo2 = new RouteInfo("RI2", "Tirunelveli", "Chennai", 635, LocalTime.of(10, 0));
    }

    @Test
    void listRouteInfo() {
        when(routeInfoRepository.findAll()).thenReturn(Arrays.asList(routeInfo1, routeInfo2));
        List<RouteInfo> patientList = routeInfoService.listRouteInfo();

        // validate
        assertEquals(2, patientList.size());
        verify(routeInfoRepository, times(1)).findAll();
    }

    @Test
    void createRouteInfo() {
        when(routeInfoRepository.save(any(RouteInfo.class))).thenReturn(routeInfo1);
        RouteInfo bookingInfo = routeInfoService.createRouteInfo(routeInfo1);

        // validate
        assertNotNull(bookingInfo);
        assertEquals("Tirunelveli", bookingInfo.getOrigin());
        verify(routeInfoRepository, times(1)).save(routeInfo1);
    }

    @Test
    void findByRouteInfoId() {
        when(routeInfoRepository.findByRouteInfoId(routeInfo2.getRouteInfoId())).thenReturn(routeInfo2);
        RouteInfo bookingInfo = routeInfoService.findByRouteInfoId(routeInfo2.getRouteInfoId());

        assertEquals("Tirunelveli", bookingInfo.getOrigin());
        verify(routeInfoRepository, times(1)).findByRouteInfoId(routeInfo2.getRouteInfoId());
    }

    @Test
    void updateRouteInfo() {
        RouteInfo updatePat = new RouteInfo("RI2", "Tirunelveli", "Chennai", 636, LocalTime.of(10, 0));

        when(routeInfoRepository.findByRouteInfoId("RI2")).thenReturn(routeInfo2);
        when(routeInfoRepository.save(any(RouteInfo.class))).thenReturn(updatePat);

        routeInfoService.updateRouteInfo("RI2", updatePat);
        verify(routeInfoRepository, times(1)).findByRouteInfoId("RI2");
        verify(routeInfoRepository, times(1)).save(routeInfo2);
    }

    @Test
    void deleteByRouteInfoId() {
        routeInfoService.deleteRouteInfo("RI1");
        verify(routeInfoRepository, times(1)).deleteByRouteInfoId("RI1");
    }
}
