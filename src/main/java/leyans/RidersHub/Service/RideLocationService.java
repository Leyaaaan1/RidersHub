package leyans.RidersHub.Service;

import leyans.RidersHub.DTO.NearbyRiderDTO;
import leyans.RidersHub.DTO.Response.LocationsResponseDTO;
import leyans.RidersHub.Repository.RideLocationRepository;
import leyans.RidersHub.Repository.RiderRepository;
import leyans.RidersHub.model.RideLocation;
import leyans.RidersHub.model.Rider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RideLocationService {
    private final RideLocationRepository rideLocationRepository;
    private final RiderRepository riderRepository;

    @Autowired
    private final KafkaTemplate<Object, LocationsResponseDTO> kafkaTemplate;

    @Autowired
    private final SimpMessagingTemplate messagingTemplate;

    public RideLocationService(RideLocationRepository rideLocationRepository,
                               RiderRepository riderRepository,
                               KafkaTemplate<Object, LocationsResponseDTO> kafkaTemplate,
                               SimpMessagingTemplate messagingTemplate) {
        this.rideLocationRepository = rideLocationRepository;
        this.riderRepository = riderRepository;
        this.kafkaTemplate = kafkaTemplate;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public LocationsResponseDTO startRide(String username, String locationName, double latitude, double longitude) {
        // Find the rider
        Rider rider = riderRepository.findByUsername(username);


        // Check if rider already has an active ride
        Optional<RideLocation> existingRide = rideLocationRepository.findByRiderUsernameAndStarted(username, true);
        if (existingRide.isPresent()) {
            throw new RuntimeException("Rider already has an active ride");
        }

        // Create new ride location
        RideLocation rideLocation = new RideLocation();
        rideLocation.setLocationName(locationName);
        rideLocation.setRider(rider);
        rideLocation.setLatitude(latitude);
        rideLocation.setLongitude(longitude);
        rideLocation.setStarted(true);
        rideLocation.setLastUpdated(LocalDateTime.now());
        rideLocation.setCurrentRideId(UUID.randomUUID().toString());

        rideLocation = rideLocationRepository.save(rideLocation);

        // Create response DTO
        LocationsResponseDTO responseDTO = LocationsResponseDTO.fromEntity(rideLocation);

        // Send to Kafka
        kafkaTemplate.send("ride-locations", responseDTO);

        // Send WebSocket update
        sendWebSocketUpdate(responseDTO);

        return responseDTO;
    }

    @Transactional
    public LocationsResponseDTO updateRideLocation(String username, String rideId, double latitude, double longitude) {
        // Find the ride location
        RideLocation rideLocation = rideLocationRepository.findByCurrentRideId(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found with ID: " + rideId));

        // Verify the owner
        if (!rideLocation.getRider().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized to update this ride");
        }

        // Update location
        rideLocation.setLatitude(latitude);
        rideLocation.setLongitude(longitude);
        rideLocation.setLastUpdated(LocalDateTime.now());

        rideLocation = rideLocationRepository.save(rideLocation);

        // Create response DTO
        LocationsResponseDTO responseDTO = LocationsResponseDTO.fromEntity(rideLocation);

        // Send to Kafka
        kafkaTemplate.send("ride-locations", responseDTO);

        // Send WebSocket update
        sendWebSocketUpdate(responseDTO);

        return responseDTO;
    }

    @Transactional
    public LocationsResponseDTO endRide(String username, String rideId) {
        // Find the ride location
        RideLocation rideLocation = rideLocationRepository.findByCurrentRideId(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found with ID: " + rideId));

        // Verify the owner
        if (!rideLocation.getRider().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized to end this ride");
        }

        // End the ride
        rideLocation.setStarted(false);
        rideLocation = rideLocationRepository.save(rideLocation);

        // Create response DTO
        LocationsResponseDTO responseDTO = LocationsResponseDTO.fromEntity(rideLocation);

        // Send to Kafka
        kafkaTemplate.send("ride-locations", responseDTO);

        // Send WebSocket update
        sendWebSocketUpdate(responseDTO);

        return responseDTO;
    }

    public List<NearbyRiderDTO> findNearbyRiders(String username, double latitude, double longitude, double radiusInMeters) {
        // Find the rider
        Rider rider = riderRepository.findByUsername(username);

        // Query for nearby riders
        List<RideLocation> nearbyRidersData = rideLocationRepository.findNearbyRiders(
                latitude, longitude, rider.getId().longValue(), radiusInMeters);

        // Convert to DTOs
        return nearbyRidersData.stream()
                .map(rl -> {
                    // Calculate distance manually
                    double distance = calculateDistance(latitude, longitude, rl.getLatitude(), rl.getLongitude());

                    return new NearbyRiderDTO(
                            rl.getId(),
                            rl.getRider().getUsername(),
                            rl.getLocationName(),
                            rl.getLatitude(),
                            rl.getLongitude(),
                            distance
                    );
                })
                .collect(Collectors.toList());
    }

    // Calculate distance between two points using Haversine formula
    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        // Earth's radius in meters
        final int R = 6371000;

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    // Send WebSocket update
    private void sendWebSocketUpdate(LocationsResponseDTO locationUpdate) {
        messagingTemplate.convertAndSend("/topic/ride-locations", locationUpdate);

        // Generate HTML view of the current location
        String htmlView = generateLocationHtml(locationUpdate);
        messagingTemplate.convertAndSend("/topic/ride-locations/html/" + locationUpdate.getCurrentRideId(), htmlView);
    }

    // Generate HTML for location update
    private String generateLocationHtml(LocationsResponseDTO location) {
        return "<div class=\"location-update\">"
                + "<h3>Location Update</h3>"
                + "<p><strong>Rider:</strong> " + location.getRiderUsername() + "</p>"
                + "<p><strong>Location:</strong> " + location.getLocationName() + "</p>"
                + "<p><strong>Coordinates:</strong> " + location.getLatitude() + ", " + location.getLongitude() + "</p>"
                + "<p><strong>Last Updated:</strong> " + location.getLastUpdated() + "</p>"
                + "<p><strong>Status:</strong> " + (location.isStarted() ? "Active" : "Ended") + "</p>"
                + "</div>";
    }
}