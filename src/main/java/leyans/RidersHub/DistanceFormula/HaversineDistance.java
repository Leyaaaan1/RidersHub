package leyans.RidersHub.DistanceFormula;

import org.springframework.stereotype.Service;

@Service
public class HaversineDistance {

    private double prevLat = 0.0;
    private double prevLon = 0.0;
    private boolean isFirstUpdate = true;

    // New method to return distance and update decision
    public DistanceResult shouldSendUpdate(double newLat, double newLon, long minutesSinceLastUpdate) {
        if (isFirstUpdate) {
            prevLat = newLat;
            prevLon = newLon;
            isFirstUpdate = false;
            return new DistanceResult(0.0, true);
        }

        double distance = calculateHaversineDistance(prevLat, prevLon, newLat, newLon);

        System.out.println("📏 Distance moved: " + distance + " meters");
        boolean shouldUpdate = (distance > 1) || (minutesSinceLastUpdate >= 1);

        if (shouldUpdate ) {
            prevLat = newLat;
            prevLon = newLon;
            System.out.println("📡 Sending update to Kafka");
        }
        return new DistanceResult(distance, shouldUpdate);
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


    public record DistanceResult(double distance, boolean shouldUpdate) {
    }
}
