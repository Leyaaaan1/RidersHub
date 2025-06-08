package leyans.RidersHub.Controller;

import leyans.RidersHub.Service.MapService.MapBox.MapboxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/location")
public class MapboxController {
    private final MapboxService mapboxService;

    @Autowired
    public MapboxController(MapboxService mapboxService) {
        this.mapboxService = mapboxService;
    }

    @GetMapping("/staticImage")
    public String getMapImage(@RequestParam double longitude, @RequestParam double latitude) {
        return mapboxService.getStaticMapImageUrl(longitude, latitude);
    }



}