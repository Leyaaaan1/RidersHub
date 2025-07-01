package leyans.RidersHub.Service;

import leyans.RidersHub.Repository.PsgcDataRepository;
import leyans.RidersHub.Repository.RiderLocationRepository;
import leyans.RidersHub.Service.MapService.NominatimService;
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

    private final RiderLocationRepository riderLocationRepository;


    public LocationService(PsgcDataRepository psgcDataRepository, NominatimService nominatimService, RiderLocationRepository riderLocationRepository) {
        this.psgcDataRepository = psgcDataRepository;
        this.nominatimService = nominatimService;
        this.riderLocationRepository = riderLocationRepository;

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

    public String resolveLandMark(String fallback, double lat, double lon) {
        String landmark = nominatimService.getCityOrLandmarkFromCoordinates(lat, lon);
        if (landmark == null) {
            return fallback != null ? fallback : "Lat: " + lat + ", Lng: " + lon;
        }
        if (landmark.matches("\\d+")) {
            return psgcDataRepository.findByNameIgnoreCase(fallback)
                    .stream()
                    .findFirst()
                    .map(PsgcData::getName)
                    .orElse(fallback != null ? fallback : "Lat: " + lat + ", Lng: " + lon);
        }
        return landmark;
    }

    public int calculateDistance(Point startPoint, Point endPoint) {
        double distanceInMeters = riderLocationRepository.getDistanceBetweenPoints(startPoint, endPoint);
        return (int) Math.round(distanceInMeters / 1000);
    }





}
