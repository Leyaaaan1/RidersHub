package leyans.RidersHub.Service;


import leyans.RidersHub.DTO.Response.StartRideResponseDTO;
import leyans.RidersHub.Repository.RidesRepository;
import leyans.RidersHub.Repository.StartedRideRepository;
import leyans.RidersHub.model.Rides;
import leyans.RidersHub.model.StartedRide;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class StartRideService {

    private final RidesRepository ridesRepository;
    private final StartedRideRepository startedRideRepository;
    private final KafkaTemplate<Object, StartRideResponseDTO> kafkaTemplate;

    @Autowired
    public StartRideService(RidesRepository ridesRepository,
                            StartedRideRepository startedRideRepository,
                            KafkaTemplate<Object, StartRideResponseDTO> kafkaTemplate) {
        this.ridesRepository = ridesRepository;
        this.startedRideRepository = startedRideRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Transactional
    public StartRideResponseDTO startRide(Integer rideId) {
        Rides ride = ridesRepository.findById(rideId)
                .orElseThrow(() -> new IllegalArgumentException("Ride not found with id: " + rideId));

        StartedRide started = new StartedRide(ride, LocalDateTime.now());
        started = startedRideRepository.save(started);

        StartRideResponseDTO response = new StartRideResponseDTO(
                ride.getRidesId(),
                ride.getRidesName(),
                ride.getLocationName(),
                started.getStartTime()
        );

        kafkaTemplate.send("rides-started", response);
        return response;
    }
}
