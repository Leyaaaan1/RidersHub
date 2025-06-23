package leyans.RidersHub.Controller;



import leyans.RidersHub.DTO.LocationImageRequest;
import leyans.RidersHub.DTO.Response.LocationImageResponse;
import leyans.RidersHub.Service.WikimediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/location")
public class LocationImageController {

    private final WikimediaService wikimediaService;

    @Autowired
    public LocationImageController(WikimediaService wikimediaService) {
        this.wikimediaService = wikimediaService;
    }

    @GetMapping("/images")
    public ResponseEntity<List<LocationImageResponse>> getLocationImages(
            @RequestParam String locationName,
            @RequestParam(required = false, defaultValue = "5") int limit) {
        List<LocationImageResponse> images = wikimediaService.getLocationImages(locationName, limit);
        return ResponseEntity.ok(images);
    }

    @PostMapping("/images")
    public ResponseEntity<List<LocationImageResponse>> getLocationImagesPost(
            @RequestBody LocationImageRequest request) {
        List<LocationImageResponse> images = wikimediaService.getLocationImages(
                request.getLocationName(), request.getLimit());
        return ResponseEntity.ok(images);
    }
}