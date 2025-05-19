package leyans.RidersHub.Controller;

import leyans.RidersHub.DTO.Response.LocationsResponseDTO;
import leyans.RidersHub.Service.RideLocationService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

@Controller
public class RideLocationWebSocketController {

    private final RideLocationService rideLocationService;

    public RideLocationWebSocketController(RideLocationService rideLocationService) {
        this.rideLocationService = rideLocationService;
    }

    @MessageMapping("/location-update")
    @SendTo("/topic/ride-locations")
    public LocationsResponseDTO handleLocationUpdate(LocationUpdateRequest request, Authentication authentication) {
        String username = authentication.getName();

        // Process the location update
        return rideLocationService.updateRideLocation(
                username,
                request.getRideId(),
                request.getLatitude(),
                request.getLongitude());
    }

    // Request class for WebSocket location updates
    public static class LocationUpdateRequest {
        private String rideId;
        private double latitude;
        private double longitude;

        public String getRideId() {
            return rideId;
        }

        public void setRideId(String rideId) {
            this.rideId = rideId;
        }

        public double getLatitude() {
            return latitude;
        }

        public void setLatitude(double latitude) {
            this.latitude = latitude;
        }

        public double getLongitude() {
            return longitude;
        }

        public void setLongitude(double longitude) {
            this.longitude = longitude;
        }
    }
}