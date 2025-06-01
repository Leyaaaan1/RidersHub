package leyans.RidersHub.Service;


import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import org.springframework.http.HttpHeaders;
import java.util.Map;

@Component
public class NominatimService {
    private final RestTemplate restTemplate = new RestTemplate();


    public String getBarangayNameFromCoordinates(double lat, double lon) {
        String url = "https://nominatim.openstreetmap.org/reverse?" +
                "format=json&lat=" +
                lat + "&lon=" + lon + "&zoom=18&addressdetails=1";

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "SpringBootApp");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("address")) {
                Map<String, String> address = (Map<String, String>) body.get("address");

                // Barangay is usually returned as "neighbourhood" or "suburb" or "village"
                return address.getOrDefault("village",
                        address.getOrDefault("neighbourhood",
                                address.getOrDefault("suburb", null)));
            }
        } catch (Exception e) {
            System.err.println("Nominatim Error: " + e.getMessage());
        }

        return null;
    }
}
