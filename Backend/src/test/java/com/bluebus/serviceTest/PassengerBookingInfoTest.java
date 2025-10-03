package com.bluebus.serviceTest;

import com.bluebus.entity.PassengerBookingInfo;
import com.bluebus.repository.PassengerBookingInfoRep;
import com.bluebus.service.PassengerBookingInfoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PassengerBookingInfoTest {

    @Mock
    private PassengerBookingInfoRep passengerBookingInfoRepository;

    @InjectMocks
    private PassengerBookingInfoService passengerBookingInfoService;

    private PassengerBookingInfo bookingInfo1;
    private PassengerBookingInfo bookingInfo2;

    @BeforeEach
    void setup() {
        bookingInfo1 = new PassengerBookingInfo("PBI1", "PNR123", "BI1", LocalDateTime.of(2025, 5, 10, 14, 30), "P1", "John Doe", "Male", "A12", "Credit Card", "9876543210", "john@example.com");
        bookingInfo2 = new PassengerBookingInfo("PBI2", "PNR456", "BI2", LocalDateTime.of(2025, 5, 12, 10, 15), "P2", "Jane Smith", "Female", "B14", "UPI", "8765432109", "jane@example.com");
    }

    @Test
    void listAllBookings() {
        when(passengerBookingInfoRepository.findAll()).thenReturn(Arrays.asList(bookingInfo1, bookingInfo2));
        List<PassengerBookingInfo> bookingList = passengerBookingInfoService.listPBIR();

        assertEquals(2, bookingList.size());
        verify(passengerBookingInfoRepository, times(1)).findAll();
    }

    @Test
    void createBooking() {
        when(passengerBookingInfoRepository.save(any(PassengerBookingInfo.class))).thenReturn(bookingInfo1);
        PassengerBookingInfo savedBooking = passengerBookingInfoService.createPBIR(bookingInfo1);

        assertNotNull(savedBooking);
        assertEquals("PNR123", savedBooking.getPnrNumber());
        verify(passengerBookingInfoRepository, times(1)).save(bookingInfo1);
    }

    @Test
    void getBookingById() {
        when(passengerBookingInfoRepository.findByPassengerBookingInfoId(bookingInfo2.getPassengerBookingInfoId())).thenReturn(bookingInfo2);
        PassengerBookingInfo retrievedBooking = passengerBookingInfoService.findByPassengerBookingInfoId(bookingInfo2.getPassengerBookingInfoId());

        assertEquals("PNR456", retrievedBooking.getPnrNumber());
        verify(passengerBookingInfoRepository, times(1)).findByPassengerBookingInfoId(bookingInfo2.getPassengerBookingInfoId());
    }

    @Test
    void deleteBookingById() {
        passengerBookingInfoService.deletePBIR("PBI1");
        verify(passengerBookingInfoRepository, times(1)).deleteByPassengerBookingInfoId("PBI1");
    }
}

