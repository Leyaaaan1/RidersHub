package leyans.RidersHub.Controller;

import leyans.RidersHub.DTO.LocationImageDto;
import leyans.RidersHub.Service.MapService.WikimediaImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wikimedia")
public class WikimediaImageController {

    @Autowired
    private WikimediaImageService wikimediaImageService;

    @GetMapping("/location")
    public ResponseEntity<LocationImageDto> getLocationImage(@RequestParam String locationName) {
        LocationImageDto cachedImage = wikimediaImageService.checkCachedLocationImage(locationName);

        if (cachedImage != null) {
            return ResponseEntity.ok(cachedImage);
        }

        LocationImageDto imageDto = wikimediaImageService.getLocationImage(locationName);

        if (imageDto == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(imageDto);
    }
}
