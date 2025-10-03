package com.bluebus.serviceTest;

import com.bluebus.entity.BlockedSeats;
import com.bluebus.repository.BlockedSeatsRepository;
import com.bluebus.service.BlockedSeatsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BusBookingInfoTest {

    @Mock
    private BlockedSeatsRepository busBookingInfoRepository;

    @InjectMocks
    private BlockedSeatsService busBookingInfoService;

    private BlockedSeats bookingInfo1;
    private BlockedSeats bookingInfo2;

    @BeforeEach
    void setup() {
        bookingInfo1 = new BlockedSeats("BBI1", "B1", "A12", LocalDate.of(2025, 5, 10), "Male");
        bookingInfo2 = new BlockedSeats("BBI2", "B2", "B14", LocalDate.of(2025, 5, 12), "Female");
    }

    @Test
    void listAllBookings() {
        when(busBookingInfoRepository.findAll()).thenReturn(Arrays.asList(bookingInfo1, bookingInfo2));
        List<BlockedSeats> bookingList = busBookingInfoService.listBBIR();

        assertEquals(2, bookingList.size());
        verify(busBookingInfoRepository, times(1)).findAll();
    }

    @Test
    void createBooking() {
        when(busBookingInfoRepository.save(any(BlockedSeats.class))).thenReturn(bookingInfo1);
        BlockedSeats savedBooking = busBookingInfoService.createBBIR(bookingInfo1);

        assertNotNull(savedBooking);
        assertEquals("B1", savedBooking.getBusId());
        verify(busBookingInfoRepository, times(1)).save(bookingInfo1);
    }

    @Test
    void getBookingById() {
        when(busBookingInfoRepository.findByBusBookingInfoId(bookingInfo2.getBusBookingInfoId())).thenReturn(bookingInfo2);
        BlockedSeats retrievedBooking = busBookingInfoService.findByBusBookingInfoId(bookingInfo2.getBusBookingInfoId());

        assertEquals("B2", retrievedBooking.getBusId());
        verify(busBookingInfoRepository, times(1)).findByBusBookingInfoId(bookingInfo2.getBusBookingInfoId());
    }

    @Test
    void deleteBookingById() {
        busBookingInfoService.deleteByBusBookingInfoId("BBI1");
        verify(busBookingInfoRepository, times(1)).deleteByBusBookingInfoId("BBI1");
    }

    @Test
    void updateBooking() {
        // Mock existing booking info
        when(busBookingInfoRepository.findByBusBookingInfoId(bookingInfo1.getBusBookingInfoId()))
                .thenReturn(bookingInfo1);

        // Modify the booking details
        bookingInfo1.setBookedSeatNum("A15");
        bookingInfo1.setPassengerGender("Female");

        when(busBookingInfoRepository.save(any(BlockedSeats.class)))
                .thenReturn(bookingInfo1);

        BlockedSeats updatedBooking = busBookingInfoService.updateBBIR(bookingInfo1.getBusBookingInfoId(), bookingInfo1);

        // Validate the updated values
        assertNotNull(updatedBooking);
        assertEquals("A15", updatedBooking.getBookedSeatNum());
        assertEquals("Female", updatedBooking.getPassengerGender());

        verify(busBookingInfoRepository, times(1)).findByBusBookingInfoId(bookingInfo1.getBusBookingInfoId());
        verify(busBookingInfoRepository, times(1)).save(bookingInfo1);
    }


}

