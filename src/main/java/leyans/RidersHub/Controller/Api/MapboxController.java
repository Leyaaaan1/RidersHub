package leyans.RidersHub.Controller.Api;

import leyans.RidersHub.DTO.StopPointDTO;
import leyans.RidersHub.Service.MapService.MapBox.MapboxService;
import leyans.RidersHub.Service.RidesService;
import leyans.RidersHub.model.StopPoint;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
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
        String cachedImageUrl = mapboxService.checkCachedMapImage(lon, lat);

        if (cachedImageUrl != null) {
            return ResponseEntity.ok(cachedImageUrl);
        }

        String imageUrl = mapboxService.getStaticMapImageUrl(lon, lat);
        return ResponseEntity.ok(imageUrl);
    }


    @GetMapping("/directions")
    public ResponseEntity<Map<String, Object>> getRoute(
            @RequestParam double startLat,
            @RequestParam double startLng,
            @RequestParam(required = false) String stops,
            @RequestParam double endLat,
            @RequestParam double endLng) {

        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        Point startPoint = geometryFactory.createPoint(new Coordinate(startLng, startLat));
        Point endPoint = geometryFactory.createPoint(new Coordinate(endLng, endLat));

        List<StopPoint> stopPoints = new ArrayList<>();
        if (stops != null && !stops.isEmpty()) {
            String[] stopArr = stops.split(";");
            for (String stop : stopArr) {
                String[] latLng = stop.split(",");
                if (latLng.length == 2) {
                    double lat = Double.parseDouble(latLng[0]);
                    double lng = Double.parseDouble(latLng[1]);
                    Point stopPoint = geometryFactory.createPoint(new Coordinate(lng, lat));
                    stopPoints.add(new StopPoint(null, stopPoint));
                }
            }
        }

        List<Coordinate> routeCoordinates = mapboxService.getRouteCoordinates(startPoint, stopPoints, endPoint);

        List<List<Double>> coordinatesList = new ArrayList<>();
        for (Coordinate coord : routeCoordinates) {
            coordinatesList.add(Arrays.asList(coord.x, coord.y));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("coordinates", coordinatesList);

        return ResponseEntity.ok(response);
    }
}





