package leyans.RidersHub.Service.MapService;


import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import org.springframework.http.HttpHeaders;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
public class NominatimService {
    private final RestTemplate restTemplate;
    private final Bucket bucket;

    public NominatimService() {
        this.restTemplate = new RestTemplate();

        Bandwidth limit = Bandwidth.classic(1, Refill.greedy(1, Duration.ofSeconds(1)));
        this.bucket = Bucket.builder().addLimit(limit).build();

    }

    private void enforceRateLimit() {
        try {
            System.out.println("Waiting for rate limit...");
            bucket.asBlocking().consume(1);
            System.out.println("Rate limit consumed, proceeding with request.");

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("Rate limiting wait was interrupted: " + e.getMessage());
        }
    }

//    First search consumes the only token in the bucket
//    When you immediately try to search again, the bucket is empty
//    Your code calls bucket.asBlocking().consume(1) which blocks the thread
//    The thread waits until a full second has passed since the first request
//    Once the token is refilled (after 1 second), the second search proceeds
    public String getBarangayNameFromCoordinates(double lat, double lon) {
        enforceRateLimit();

        String url = "https://nominatim.openstreetmap.org/reverse?" +
                "format=json&lat=" + lat + "&lon=" + lon +
                "&zoom=18&addressdetails=1" +
                "&bounded=1&viewbox=125.0,5.5,126.3,7.5&strict_bounds=1";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept-Language", "en");
        headers.set("User-Agent", "RidersHub/1.0 (paninsorolean@gmail.com)");

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
            System.err.println("Nominatim Reverse Error: " + e.getMessage());
        }

        return null;
    }





    public List<Map<String, Object>> searchLocation(String query) {
        return searchLocation(query, 5);
    }

    public List<Map<String, Object>> searchLocation(String query, int limit) {
        enforceRateLimit();

        String url = "https://nominatim.openstreetmap.org/search?" +
                "q=" + UriUtils.encodeQuery(query, StandardCharsets.UTF_8) +
                "&countrycodes=ph&format=json&limit=" + limit +
                "&addressdetails=1&bounded=1&viewbox=125.0,5.5,126.3,7.5&strict_bounds=1";

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "RidersHub/1.0 (paninsorolean@gmail.com)");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, entity, List.class);
            return response.getBody();
        } catch (Exception e) {
            System.err.println("Nominatim Search Error: " + e.getMessage());
            return Collections.emptyList();
        }
    }
}
