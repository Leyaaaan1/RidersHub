package leyans.RidersHub.Service.MapBox;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class MapboxService {
    private final String mapboxToken;
    private final MapImageService mapImageService;

    @Autowired
    public MapboxService(@Value("${MAPBOX_TOKEN}") String mapboxToken,
                         MapImageService mapImageService) {
        this.mapboxToken = mapboxToken;
        this.mapImageService = mapImageService;
    }

    public String getStaticMapImageUrl(double lon, double lat) {
        String mapboxUrl = "https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-marker+ff0000("
                + lon + "," + lat + ")/" + lon + "," + lat
                + ",14/600x300?access_token=" + mapboxToken;

        // Process image upload here directly
        return mapImageService.uploadMapImage(mapboxUrl);
    }
}