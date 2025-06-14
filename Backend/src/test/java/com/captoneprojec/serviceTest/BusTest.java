package com.captoneprojec.serviceTest;

import com.captoneprojec.entity.Bus;
import com.captoneprojec.entity.RouteInfo;
import com.captoneprojec.repository.BusRepository;
import com.captoneprojec.service.BusService;
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
public class BusTest {

    @Mock
    private BusRepository busRepository;

    @InjectMocks
    private BusService busService;

    private Bus bus1;
    private Bus bus2;

    @BeforeEach
    void setup() {
        bus1 = new Bus("B1", "KKR Travels", 10.5, true, "Left-1", "Right-1", 40, 20, true, true, true, true);
        bus2 = new Bus("B2", "OMG Travels", 12.0, false, "Left-2", "Right-2", 35, 15, false, false, true, false);
    }

    @Test
    void listAllBuses() {
        when(busRepository.findAll()).thenReturn(Arrays.asList(bus1, bus2));
        List<Bus> busList = busService.listBus();

        assertEquals(2, busList.size());
        verify(busRepository, times(1)).findAll();
    }

    @Test
    void createBus() {
        when(busRepository.save(any(Bus.class))).thenReturn(bus1);
        Bus savedBus = busService.createBus(bus1);

        assertNotNull(savedBus);
        assertEquals("KKR Travels", savedBus.getBusName());
        verify(busRepository, times(1)).save(bus1);
    }

    @Test
    void getBusById() {
        when(busRepository.findByBusId(bus2.getBusId())).thenReturn(bus2);
        Bus retrievedBus = busService.findByBusId(bus2.getBusId());

        assertEquals("OMG Travels", retrievedBus.getBusName());
        verify(busRepository, times(1)).findByBusId(bus2.getBusId());
    }

    @Test
    void updateBus() {
        Bus updatePat = new Bus("B2", "OMG Travel", 12.0, false, "Left-2", "Right-2", 35, 15, false, false, true, false);

        when(busRepository.findByBusId("B2")).thenReturn(bus2);
        when(busRepository.save(any(Bus.class))).thenReturn(updatePat);

        busService.updateBus("B2", updatePat);
        verify(busRepository, times(1)).findByBusId("B2");
        verify(busRepository, times(1)).save(updatePat);
    }

    @Test
    void deleteBusById() {
        busService.deleteBus("B1");
        verify(busRepository, times(1)).deleteByBusId("B1");
    }
}
