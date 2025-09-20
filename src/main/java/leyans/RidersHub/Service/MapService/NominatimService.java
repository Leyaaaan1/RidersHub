package leyans.RidersHub.Service.MapService;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.core.type.TypeReference;

import org.springframework.http.HttpHeaders;
import org.springframework.web.util.UriUtils;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
public class NominatimService {
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final RestTemplate restTemplate;


    @Value("${USER_AGENT}")
    private String userAgent;

    @Value("${NOMINATIM_API_BASE}")
    private String nominatimApiBase;


    public NominatimService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }


    public String getBarangayNameFromCoordinates(double lat, double lon) {
        return getBarangayNameFromCoordinatesInternal(lat, lon);
    }
    private String getBarangayNameFromCoordinatesInternal(double lat, double lon) {


        String url = nominatimApiBase + "/reverse?" +
                "format=json&lat=" + lat + "&lon=" + lon +
                "&zoom=18&addressdetails=1" +
                "&bounded=1&viewbox=125.0,5.5,126.3,7.5&strict_bounds=1";

        HttpHeaders headers = createHeaders();
        headers.set("Accept-Language", "en");
        headers.set("User-Agent", userAgent);

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

    public String getCityOrLandmarkFromCoordinates(double lat, double lon) {
        return getCityOrLandmarkFromCoordinatesInternal(lat, lon);
    }

    public String getCityOrLandmarkFromCoordinatesInternal(double lat, double lon) {
        String url = nominatimApiBase + "/reverse?" +
                "format=json&lat=" + lat + "&lon=" + lon +
                "&zoom=18&addressdetails=1" +
                "&bounded=1&viewbox=125.0,5.5,126.3,7.5&strict_bounds=1";

        HttpHeaders headers = createHeaders();
        headers.set("Accept-Language", "en");
        headers.set("User-Agent", userAgent);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            Map<String, Object> body = response.getBody();

            if (body != null && body.containsKey("address")) {
                Map<String, String> address = (Map<String, String>) body.get("address");

                // 1. Try to get most specific location name
                String[] landmarkKeys = {
                        "attraction", "tourism", "leisure", "historic", "building", "stadium", "mall", "theatre",
                        "hotel", "resort", "camp_site", "natural", "park", "museum", "man_made", "place", "shop"
                };

                for (String key : landmarkKeys) {
                    if (address.containsKey(key)) {
                        return address.get(key);  // Return the most specific result
                    }
                }

                // 2. Fallback to display_name's first segment if available
                if (body.containsKey("display_name")) {
                    String displayName = (String) body.get("display_name");
                    return displayName.split(",")[0].trim();  // First part is usually landmark name
                }

                // 3. Fallback to city/town/county
                return address.getOrDefault("city",
                        address.getOrDefault("town",
                                address.getOrDefault("county", null)));
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
        System.out.println(" searchLocation (cache miss)");

        String url = nominatimApiBase + "/search?" +
                "q=" + UriUtils.encodeQuery(query, StandardCharsets.UTF_8) +
                "&countrycodes=ph&format=json&limit=" + limit +
                "&addressdetails=1&bounded=1&viewbox=125.0,5.5,126.3,7.5&strict_bounds=1";

        HttpHeaders headers = createHeaders();
        headers.set("User-Agent", userAgent);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, entity, List.class);
            return response.getBody();
        } catch (Exception e) {
            System.err.println("Nominatim Search Error: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<Map<String, Object>> searchCityOrLandmark(String query) {
        return searchCityOrLandmark(query, 5);

    }

    public List<Map<String, Object>> searchCityOrLandmark(String query, int limit) {

        System.out.println(" searchCityOrLandmark (cache miss)");
        try {
            String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
            String url = String.format(
                    "%s/search?q=%s&format=jsonv2&addressdetails=1&limit=%d&countrycodes=ph",
                    nominatimApiBase, encodedQuery, limit * 2
            );

            HttpHeaders headers = createHeaders();
            headers.set("User-Agent", userAgent);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, String.class
            );

            String json = response.getBody();
            List<Map<String, Object>> results = objectMapper.readValue(json, new TypeReference<>() {});
            if (results == null || results.isEmpty()) return Collections.emptyList();

            List<Map<String, Object>> filteredResults = new ArrayList<>();

            List<String> landmarkKeys = List.of(
                    "attraction", "tourism", "historic", "leisure", "building", "stadium", "mall", "theatre",
                    "amenity", "hotel", "resort", "camp_site", "natural", "park", "museum", "man_made", "shop", "place"
            );

            for (Map<String, Object> result : results) {
                Map<String, Object> address = (Map<String, Object>) result.get("address");
                boolean isLandmark = false;

                for (String key : landmarkKeys) {
                    if (address != null && address.containsKey(key)) {
                        result.put("place_type", "landmark");
                        filteredResults.add(result);
                        isLandmark = true;
                        break;
                    }
                }

                if (!isLandmark && address != null) {
                    if (address.containsKey("city")) {
                        result.put("place_type", "city");
                        filteredResults.add(result);
                    } else if (address.containsKey("town")) {
                        result.put("place_type", "town");
                        filteredResults.add(result);
                    }
                }

                if (filteredResults.size() >= limit) break;
            }

            // Fallback in case nothing matches
            if (filteredResults.isEmpty()) {
                for (Map<String, Object> fallback : results.subList(0, Math.min(limit, results.size()))) {
                    fallback.putIfAbsent("place_type", "landmark");
                    filteredResults.add(fallback);
                }
            }

            return filteredResults;
        } catch (Exception e) {
            System.err.println("Nominatim Search Error: " + e.getMessage());
            return Collections.emptyList();
        }
    }
    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept-Language", "en");
        headers.set("User-Agent", userAgent);
        return headers;
    }

}
