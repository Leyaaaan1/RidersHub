package leyans.RidersHub.Controller.Api;

import leyans.RidersHub.DTO.StopPointDTO;
import leyans.RidersHub.Service.MapService.MapBox.MapboxService;
import leyans.RidersHub.Service.RidesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/location")
public class MapboxController {
    private final MapboxService mapboxService;

    private final RidesService ridesService;

    @Autowired
    public MapboxController(MapboxService mapboxService, RidesService ridesService) {
        this.mapboxService = mapboxService;
        this.ridesService = ridesService;
    }

    @GetMapping("/staticImage")
    public ResponseEntity<String> getMapImage(@RequestParam double lon, @RequestParam double lat) {



        String imageUrl = mapboxService.getStaticMapImageUrl(lon, lat);
        return ResponseEntity.ok(imageUrl);
    }






}