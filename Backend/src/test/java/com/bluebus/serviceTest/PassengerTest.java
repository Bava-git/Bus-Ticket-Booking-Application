package com.bluebus.serviceTest;

import com.bluebus.entity.Passenger;
import com.bluebus.repository.PassengerRepository;
import com.bluebus.service.PassengerService;
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
public class PassengerTest {

    @Mock
    private PassengerRepository passengerRepository;

    @InjectMocks
    private PassengerService passengerService;

    private Passenger passenger1;
    private Passenger passenger2;

    @BeforeEach
    void setup() {
        passenger1 = new Passenger("P1", "John Doe", LocalDate.of(1995, 10, 20), "Male", "9876543210", "john@example.com");
        passenger2 = new Passenger("P2", "Jane Smith", LocalDate.of(1998, 5, 15), "Female", "8765432109", "jane@example.com");
    }

    @Test
    void listAllPassengers() {
        when(passengerRepository.findAll()).thenReturn(Arrays.asList(passenger1, passenger2));
        List<Passenger> passengerList = passengerService.listPassenger();

        assertEquals(2, passengerList.size());
        verify(passengerRepository, times(1)).findAll();
    }

    @Test
    void createPassenger() {
        when(passengerRepository.save(any(Passenger.class))).thenReturn(passenger1);
        Passenger savedPassenger = passengerService.createPassenger(passenger1);

        assertNotNull(savedPassenger);
        assertEquals("John Doe", savedPassenger.getPassengerName());
        verify(passengerRepository, times(1)).save(passenger1);
    }

    @Test
    void getPassengerById() {
        when(passengerRepository.findByPassengerId(passenger2.getPassengerId())).thenReturn(passenger2);
        Passenger retrievedPassenger = passengerService.findByPassengerId(passenger2.getPassengerId());

        assertEquals("Jane Smith", retrievedPassenger.getPassengerName());
        verify(passengerRepository, times(1)).findByPassengerId(passenger2.getPassengerId());
    }

    @Test
    void updatePassenger() {
        // Create updated passenger details
        Passenger updatedPassenger = new Passenger("P2", "Jane Doe", LocalDate.of(1998, 5, 15), "Female", "7654321098", "jane.doe@example.com");

        // Mock repository behavior
        when(passengerRepository.findByPassengerId("P2")).thenReturn(passenger2);
        when(passengerRepository.save(any(Passenger.class))).thenReturn(updatedPassenger);

        passengerService.updatePassenger("P2", updatedPassenger);

        // Verify interactions
        verify(passengerRepository, times(1)).findByPassengerId("P2");
        verify(passengerRepository, times(1)).save(passenger2);
    }
}

