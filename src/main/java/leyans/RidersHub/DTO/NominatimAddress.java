package leyans.RidersHub.DTO;

public record NominatimAddress(String barangay, String cityMun, String province, String landmark) {

    public static NominatimAddress forBarangay(String barangay, String cityMun, String province) {
        return new NominatimAddress(barangay, cityMun, province, null);
    }
    public static NominatimAddress forLandmark(String landmark) {
        return new NominatimAddress(null, null, null, landmark);
    }


    public  Boolean isBarangay() {
        return barangay != null && cityMun != null && province != null;
    }
    public  Boolean isLandmark() {
        return landmark != null;
    }
}
