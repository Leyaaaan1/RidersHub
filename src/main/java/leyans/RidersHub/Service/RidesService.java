package leyans.RidersHub.Service;


import jakarta.transaction.Transactional;
import leyans.RidersHub.DTO.Response.LocationResponseDTO;
import leyans.RidersHub.DTO.Response.RideResponseDTO;
import leyans.RidersHub.Repository.RiderRepository;
import leyans.RidersHub.Repository.RiderTypeRepository;
import leyans.RidersHub.Repository.RidesRepository;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.RiderType;
import leyans.RidersHub.model.Rides;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class RidesService {

    private final RidesRepository ridesRepository;
    private final RiderRepository riderRepository;
    private final RiderTypeRepository riderTypeRepository;

    @Autowired
    private final KafkaTemplate<Object, RideResponseDTO> kafkaTemplate;
    @Autowired



    public RidesService(RiderRepository riderRepository,
                        RiderTypeRepository riderTypeRepository, RidesRepository ridesRepository,
                        KafkaTemplate<Object, RideResponseDTO> kafkaTemplate) {
        this.riderRepository = riderRepository;
        this.riderTypeRepository = riderTypeRepository;
        this.ridesRepository = ridesRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Transactional
    public RideResponseDTO createRide(String username, String ridesName, String locationName,
                                      String riderType, Integer distance, String startingPoint,
                                      LocalDateTime date, double latitude, double longitude,
                                      String endingPoint, List<String> participantUsernames) {

        Rider rider = riderRepository.findByUsername(username);
        RiderType newRiderType = riderTypeRepository.findByRiderType(riderType);

        // 1️⃣ Save Rides Synchronously
        Rides newRides = new Rides();
        newRides.setLocationName(locationName);
        newRides.setRidesName(ridesName);
        newRides.setUsername(rider);
        newRides.setDistance(distance);
        newRides.setStartingPoint(startingPoint);
        newRides.setEndingPoint(endingPoint);
        newRides.setDate(date);
        newRides.setRiderType(newRiderType);
        newRides.setLatitude(latitude);
        newRides.setLongitude(longitude);

        if (participantUsernames != null && !participantUsernames.isEmpty()) {
            List<Rider> participants = participantUsernames.stream()
                    .map(riderRepository::findByUsername)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
            newRides.setParticipants(participants);
        }

        try {
            newRides = ridesRepository.save(newRides);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }


        RideResponseDTO ridesDTO = new RideResponseDTO(
                newRides.getLocationName(),
                newRides.getRidesName(),
                newRides.getUsername(),
                newRides.getRiderType(),
                newRides.getDistance(),
                newRides.getStartingPoint(),
                newRides.getEndingPoint(),
                newRides.getDate(),
                newRides.getLatitude(),
                newRides.getLongitude(),
                newRides.getParticipants()

        );

        kafkaTemplate.send("location", ridesDTO);
        return ridesDTO;
    }

}




