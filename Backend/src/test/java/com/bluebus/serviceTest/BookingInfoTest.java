package com.bluebus.serviceTest;

import com.bluebus.entity.BusSchedule;
import com.bluebus.repository.BusScheduleRepository;
import com.bluebus.service.BusScheduleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.times;

@ExtendWith(MockitoExtension.class)
public class BookingInfoTest {

    @Mock
    private BusScheduleRepository bookingInfoRepository;
    @InjectMocks
    private BusScheduleService bookingInfoService;

    private BusSchedule bookingInfo1;
    private BusSchedule bookingInfo2;

    @BeforeEach
    void setup() {
        bookingInfo1 = new BusSchedule(
                "BI1", "B1", "KKR Travels", 20, 10, "RI1",
                LocalDateTime.of(2025, 5, 10, 17, 0),
                LocalDateTime.of(2025, 5, 10, 17, 0), LocalTime.of(10, 0), "Tirunelveli", "Chennai", 625
        );
        bookingInfo2 = new BusSchedule(
                "BI2", "B1", "OMG Travels", 20, 10, "RI2",
                LocalDateTime.of(2025, 5, 10, 17, 0),
                LocalDateTime.of(2025, 5, 10, 17, 0), LocalTime.of(10, 0), "Tirunelveli", "Chennai", 625)
        ;
    }

    @Test
    void listPBIR() {
        when(bookingInfoRepository.findAll()).thenReturn(Arrays.asList(bookingInfo1, bookingInfo2));
        List<BusSchedule> patientList = bookingInfoService.listPBIR();

        // validate
        assertEquals(2, patientList.size());
        verify(bookingInfoRepository, times(1)).findAll();
    }

    @Test
    void createBIR() {
        when(bookingInfoRepository.save(any(BusSchedule.class))).thenReturn(bookingInfo1);
        BusSchedule bookingInfo = bookingInfoService.createBIR(bookingInfo1);

        // validate
        assertNotNull(bookingInfo);
        assertEquals("KKR Travels", bookingInfo.getBusName());
        verify(bookingInfoRepository, times(1)).save(bookingInfo1);
    }

    @Test
    void getBookingInfoId() {
        when(bookingInfoRepository.findByBookingInfoId(bookingInfo2.getBookingInfoId())).thenReturn(bookingInfo2);
        BusSchedule bookingInfo = bookingInfoService.findByBookingInfoId(bookingInfo2.getBookingInfoId());

        assertEquals("OMG Travels", bookingInfo.getBusName());
        verify(bookingInfoRepository, times(1)).findByBookingInfoId(bookingInfo2.getBookingInfoId());
    }

    @Test
    void deleteByBookingInfoId() {
        bookingInfoService.deleteBIR("BI1");
        verify(bookingInfoRepository, times(1)).deleteByBookingInfoId("BI1");
    }
}
