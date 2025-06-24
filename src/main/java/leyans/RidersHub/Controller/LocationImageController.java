package leyans.RidersHub.Controller;

import leyans.RidersHub.DTO.LocationImageDto;
import leyans.RidersHub.Service.WikimediaImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wikimedia")
public class LocationImageController {

    @Autowired
    private WikimediaImageService wikimediaImageService;

    @GetMapping("/location")
    public ResponseEntity<LocationImageDto> getLocationImage(@RequestParam String locationName) {
        LocationImageDto image = wikimediaImageService.getLocationImage(locationName);

        if (image == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(image);
    }
}
