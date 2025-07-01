package leyans.RidersHub.Controller.Api;

import leyans.RidersHub.Service.MapService.MapBox.MapboxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<String> getMapImage(@RequestParam double lon, @RequestParam double lat) {
        String cachedImageUrl = mapboxService.checkCachedMapImage(lon, lat);

        if (cachedImageUrl != null) {
            return ResponseEntity.ok(cachedImageUrl);
        }

        String imageUrl = mapboxService.getStaticMapImageUrl(lon, lat);
        return ResponseEntity.ok(imageUrl);
    }



}