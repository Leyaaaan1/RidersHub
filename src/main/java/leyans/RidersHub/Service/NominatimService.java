package leyans.RidersHub.Service;


import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import org.springframework.http.HttpHeaders;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
public class NominatimService {
    private final RestTemplate restTemplate;
    private final Object lock = new Object();
    private long lastRequestTime = 0;
    private static final long MIN_REQUEST_INTERVAL = 1000; // 1 sec per request

    public NominatimService() {
        this.restTemplate = new RestTemplate();
    }

    private void enforceRateLimit() {
        synchronized (lock) {
            long currentTime = System.currentTimeMillis();
            long timeSinceLastRequest = currentTime - lastRequestTime;

            if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
                try {
                    Thread.sleep(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }

            lastRequestTime = System.currentTimeMillis();
        }
    }

    public String getBarangayNameFromCoordinates(double lat, double lon) {
        return getBarangayNameFromCoordinates(lat, lon, 1);
    }

    public String getBarangayNameFromCoordinates(double lat, double lon, int limit) {
        enforceRateLimit();

        if (limit <= 0 || limit > 10) {
            limit = 1;
        }

        String url = "https://nominatim.openstreetmap.org/reverse?" +
                "format=json&lat=" + lat + "&lon=" + lon +
                "&zoom=18&addressdetails=1&limit=" + limit +
                "&bounded=1&viewbox=125.0,5.5,126.3,7.5&strict_bounds=1";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept-Language", "en");
        headers.set("User-Agent", "RidersHub/1.0");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("address")) {
                Map<String, String> address = (Map<String, String>) body.get("address");

                return address.getOrDefault("village",
                        address.getOrDefault("neighbourhood",
                                address.getOrDefault("suburb", null)));
            }
        } catch (Exception e) {
            System.err.println("Nominatim Error: " + e.getMessage());
        }

        return null;
    }

    public List<Map<String, Object>> searchLocation(String query) {
        return searchLocation(query, 1);
    }

    public List<Map<String, Object>> searchLocation(String query, int limit) {
        enforceRateLimit();

        if (limit <= 0 || limit > 50) {
            limit = 5;
        }

        String url = "https://nominatim.openstreetmap.org/search?"
                + "q=" + UriUtils.encodeQuery(query, StandardCharsets.UTF_8)
                + "&countrycodes=ph&format=json&limit="
                + limit + "&addressdetails=1"
                + "&bounded=1&viewbox=125.0,5.5,126.3,7.5&strict_bounds=1";

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "RidersHub/1.0");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<List> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, List.class);
            return response.getBody();
        } catch (Exception e) {
            System.err.println("Nominatim Search Error: " + e.getMessage());
            return Collections.emptyList();
        }
    }
}
