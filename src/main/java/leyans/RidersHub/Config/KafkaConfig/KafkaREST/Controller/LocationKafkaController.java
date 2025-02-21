package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Controller;

import leyans.RidersHub.Service.LocationService;
import leyans.RidersHub.model.Locations;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/locations")
public class LocationKafkaController {


    private final LocationService locationService;


    public LocationKafkaController(LocationService locationService) {
        this.locationService = locationService;
    }


    @PostMapping("/add-location")
    public Locations addLocation(
            @RequestParam("locationName") String locationName,
            @RequestParam("latitude") double  latitude,
            @RequestParam("longitude") double  longitude,
            @RequestParam("username") String username) {
        return locationService.saveLocation(username, locationName, latitude, longitude);
    }



}
