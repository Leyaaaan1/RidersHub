package leyans.RidersHub.DistanceFormula;


//Haversine Formula
//The haversine formula determines the great-circle distance between two points on a sphere given their longitudes and latitudes.
public class DistanceCalculations {

    private static final double EARTH_RADIUS = 6371000;

    public static double calculateCoordinates(double lat1, double lat2, double lon1, double lon2) {


        double lat1Rad = Math.toRadians(lat1);
        double lon1Rad = Math.toRadians(lon1);
        double lat2Rad = Math.toRadians(lat2);
        double lon2Rad = Math.toRadians(lon2);

        double deltaLat = lat2Rad - lat1Rad;
        double deltaLon = lon2Rad - lon1Rad;

        // Haversine formula
        double a = Math.pow(Math.sin(deltaLat / 2), 2) +
                Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                        Math.pow(Math.sin(deltaLon / 2), 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c;

    }
}
