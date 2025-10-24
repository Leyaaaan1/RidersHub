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

import java.util.Optional;

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
        return nominatimService.getBarangayNameFromCoordinates(lat, lon)
                .flatMap(addr -> {
                    // Only process if it's a barangay result
                    if (!addr.isBarangay()) {
                        return Optional.empty();
                    }

                    // Look up in PSGC database for official standardized name
                    return psgcDataRepository
                            .findByBarangayAndCityMunAndProvince(
                                    addr.barangay(),
                                    addr.cityMun(),
                                    addr.province()
                            )
                            .map(PsgcData::getName);
                })
                .orElse(fallback != null ? fallback : formatCoordinates(lat, lon));
    }


    public String resolveLandMark(String fallback, double lat, double lon) {
        return nominatimService.getCityOrLandmarkFromCoordinates(lat, lon)
                .map(addr -> {
                    // Only process if it's a landmark result
                    if (!addr.isLandmark()) {
                        return fallback != null ? fallback : formatCoordinates(lat, lon);
                    }

                    String landmarkName = addr.landmark();


                        return psgcDataRepository.findByNameIgnoreCase(landmarkName)
                                .stream()
                                .filter(psgc -> "City".equals(psgc.getGeographicLevel()) ||
                                        "Mun".equals(psgc.getGeographicLevel()))
                                .findFirst()
                                .map(PsgcData::getName)
                                .orElse(landmarkName); // Use Nominatim result if not in PSGC

                })
                .orElse(fallback != null ? fallback : formatCoordinates(lat, lon));
    }

    public int calculateDistance(Point startPoint, Point endPoint) {
        double distanceInMeters = riderLocationRepository.getDistanceBetweenPoints(startPoint, endPoint);
        return (int) Math.round(distanceInMeters / 1000);
    }
    private String formatCoordinates(double lat, double lon) {
        return String.format("Lat: %.6f, Lng: %.6f", lat, lon);
    }





}
