package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Controller;

import leyans.RidersHub.Config.KafkaConfig.KafkaREST.DTO.LocationResponseDTO;
import leyans.RidersHub.DTO.LocationRequest;
import leyans.RidersHub.Service.LocationService;
import leyans.RidersHub.model.Locations;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/locations")
public class LocationKafkaController {

    private final LocationService locationService;

    public LocationKafkaController(LocationService locationService) {
        this.locationService = locationService;
    }

    @PostMapping("/add-location")
    public LocationResponseDTO addLocation(@RequestBody LocationRequest locationRequest) {
        return locationService.saveLocation(
                locationRequest.getUsername(),
                locationRequest.getLocationName(),
                locationRequest.getLatitude(),
                locationRequest.getLongitude()
        );
    }
}