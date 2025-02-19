package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Controller;

import leyans.RidersHub.Config.KafkaConfig.KafkaREST.Service.LocationKafkaProducerService;
import leyans.RidersHub.DTO.LocationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LocationKafkaProducerController {

    @Autowired
    private LocationKafkaProducerService locationKafkaProducerService;

    public LocationKafkaProducerController(LocationKafkaProducerService locationKafkaProducerService) {
        this.locationKafkaProducerService = locationKafkaProducerService;
    };

    @PostMapping("/locations")
    public void SendLocation(
            @RequestParam("locationName") String locationName,
            @RequestParam("latitude") String latitude,
            @RequestParam("longitude") String longitude,
            @RequestParam("username") String username) {
        System.out.println("yawa");
        locationKafkaProducerService.sendLocation(locationName, latitude, longitude, username);
    }

    @PostMapping("sendloc")
    public void SendLoc(@RequestBody LocationRequest loc) {
        locationKafkaProducerService.sendLocation(
                loc.getLocationName(),
                loc.getLatitude(),
                loc.getLongitude(),
                loc.getUsername()
        );
        System.out.println("yawa");

    }

}
