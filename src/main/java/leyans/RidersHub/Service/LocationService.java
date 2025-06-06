package leyans.RidersHub.Service;

import leyans.RidersHub.Repository.PsgcDataRepository;
import leyans.RidersHub.model.PsgcData;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.stereotype.Service;

@Service
public class LocationService {


    private final PsgcDataRepository psgcDataRepository;
    private final NominatimService nominatimService;

    public LocationService(PsgcDataRepository psgcDataRepository, NominatimService nominatimService) {
        this.psgcDataRepository = psgcDataRepository;
        this.nominatimService = nominatimService;
    }

    public Point createPoint(double longitude, double latitude) {
        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

        Point point = geometryFactory.createPoint(new Coordinate(longitude, latitude));
        point.setSRID(4326);
        return point;
    }


    public String resolveBarangayName(String fallback, double lat, double lon) {
        String barangay = nominatimService.getBarangayNameFromCoordinates(lat, lon);
        if (barangay == null) {
            return fallback != null ? fallback : "Lat: " + lat + ", Lng: " + lon;
        }
        return psgcDataRepository.findByNameIgnoreCase(barangay)
                .stream()
                .findFirst()
                .map(PsgcData::getName)
                .orElse(barangay);
    }




}
