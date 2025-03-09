package leyans.RidersHub.DistanceFormula;

import org.springframework.stereotype.Service;

@Service
public class HaversineDistance {

    private double prevLat = 0.0;
    private double prevLon = 0.0;
    private boolean isFirstUpdate = true;

    // New method to return distance and update decision
    public DistanceResult shouldSendUpdate(double newLat, double newLon) {
        if (isFirstUpdate) {
            prevLat = newLat;
            prevLon = newLon;
            isFirstUpdate = false;
            return new DistanceResult(0.0, true);
        }

        double distance = calculateHaversineDistance(prevLat, prevLon, newLat, newLon);

        System.out.println("📏 : " + distance + " meters");

        if (distance > 100) {
            prevLat = newLat;
            prevLon = newLon;
            return new DistanceResult(distance, true);
        }
        return new DistanceResult(distance, false);
    }

    // Haversine formula
    public double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000; // Earth radius in meters
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public static class DistanceResult {
        private final double distance;
        private final boolean shouldUpdate;

        public DistanceResult(double distance, boolean shouldUpdate) {
            this.distance = distance;
            this.shouldUpdate = shouldUpdate;
        }

        public double getDistance() {
            return distance;
        }

        public boolean shouldUpdate() {
            return shouldUpdate;
        }
    }
}
