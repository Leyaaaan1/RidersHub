package leyans.RidersHub.Service;


import leyans.RidersHub.DTO.Response.RideResponseDTO;
import leyans.RidersHub.DTO.Response.StartRideResponseDTO;
import leyans.RidersHub.Repository.RidesRepository;
import leyans.RidersHub.Repository.StartedRideRepository;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.Rides;
import leyans.RidersHub.model.StartedRide;
import org.hibernate.Hibernate;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

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

        Rides ride = ridesRepository.findByIdWithParticipants(rideId)
                .orElseThrow(() -> new IllegalArgumentException("Ride not found with id: " + rideId));

//        GeometryFactory geometryFactory = new GeometryFactory();
//        Point coordinates = geometryFactory.createPoint(new Coordinate(ride.getLongitude(), ride.getLatitude()));
//        coordinates.setSRID(4326);

        double longitude = 0.0;
        double latitude = 0.0;
        if (ride.getLocation() != null) {
            longitude = ride.getLocation().getX();
            latitude = ride.getLocation().getY();
        }


        StartedRide started = new StartedRide(
                ride,
                LocalDateTime.now(),
                ride.getLocation(),
                ride.getParticipants()
        );

        List<String> participantUsernames = ride.getParticipants().stream()
                .map(Rider::getUsername)
                .toList();

        started = startedRideRepository.save(started);

        StartRideResponseDTO responseDTO = new StartRideResponseDTO(
                ride.getRidesId(),
                ride.getRidesName(),
                ride.getLocationName(),
                participantUsernames,
                longitude,
                latitude,
                started.getStartTime()
        );

        kafkaTemplate.send("ride-started", responseDTO);
        return responseDTO;

}
}

