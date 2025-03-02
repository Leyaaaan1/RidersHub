package leyans.RidersHub.DistanceFormula;

import org.springframework.stereotype.Service;

@Service
public class HaversineDistance {


    private double prevLat = 0.0;
    private double prevLon = 0.0;
    private boolean isFirstUpdate = true;

    /**
     * Checks if the new location update should be sent based on distance moved.
     * @param newLat New latitude
     * @param newLon New longitude
     * @return true if the user moved significantly, false otherwise
     */
    public boolean shouldSendUpdate(double newLat, double newLon) {
        if (isFirstUpdate) {
            prevLat = newLat;
            prevLon = newLon;
            isFirstUpdate = false;
            return true;

        }

        double distance = calculateHaversineDistance(prevLat, prevLon, newLat, newLon);

        System.out.println("📏 Distance moved: " + distance + " meters");

        if (distance > 100) {
            prevLat = newLat;
            prevLon = newLon;
            return true;
        }
        return false;
    }
//    public double getDistance() {
//        return dis
//
//    }

    /**
     * Uses the Haversine formula to calculate distance between two GPS points.
     * @param lat1 Latitude of first point
     * @param lon1 Longitude of first point
     * @param lat2 Latitude of second point
     * @param lon2 Longitude of second point
     * @return Distance in meters
     */
    public double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }



}
