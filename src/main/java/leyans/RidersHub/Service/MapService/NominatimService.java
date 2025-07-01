package leyans.RidersHub.Service.MapService;


import com.fasterxml.jackson.databind.ObjectMapper;
import leyans.RidersHub.Util.RateLimitUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
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
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RateLimitUtil rateLimitUtil;
    private static final String RATE_LIMIT_KEY = "nominatim_api";

    @Value("${USER_AGENT}")
    private String userAgent;


    public NominatimService( RateLimitUtil rateLimitUtil) {
        this.rateLimitUtil = rateLimitUtil;
        this.restTemplate = new RestTemplate();



    }

    @Cacheable(value = "geocoding", key = "'barangay_' + #lat + '_' + #lon", unless = "#result == null")
    public String getBarangayNameFromCoordinates(double lat, double lon) {
        return getBarangayNameFromCoordinatesInternal(lat, lon);
    }
    private String getBarangayNameFromCoordinatesInternal(double lat, double lon) {
        rateLimitUtil.freeApiAllowed(RATE_LIMIT_KEY);


        String url = "https://nominatim.openstreetmap.org/reverse?" +
                "format=json&lat=" + lat + "&lon=" + lon +
                "&zoom=18&addressdetails=1" +
                "&bounded=1&viewbox=125.0,5.5,126.3,7.5&strict_bounds=1";

        HttpHeaders headers = new HttpHeaders();
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

    @Cacheable(value = "geocoding", key = "'city_' + #lat + '_' + #lon", unless = "#result == null")
    public String getCityOrLandmarkFromCoordinates(double lat, double lon) {
        return getCityOrLandmarkFromCoordinatesInternal(lat, lon);
    }

    private String getCityOrLandmarkFromCoordinatesInternal(double lat, double lon) {
        rateLimitUtil.freeApiAllowed(RATE_LIMIT_KEY);

        String url = "https://nominatim.openstreetmap.org/reverse?" +
                "format=json&lat=" + lat + "&lon=" + lon +
                "&zoom=14&addressdetails=1" +
                "&bounded=1&viewbox=125.0,5.5,126.3,7.5&strict_bounds=1";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept-Language", "en");
        headers.set("User-Agent", userAgent);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            Map<String, Object> body = response.getBody();

            if (body != null) {
                String displayName = (String) body.get("display_name");

                if (body.containsKey("address")) {
                    Map<String, String> address = (Map<String, String>) body.get("address");

                    String landmark = address.getOrDefault("tourism",
                            address.getOrDefault("historic",
                                    address.getOrDefault("amenity", null)));

                    if (landmark != null) {
                        return landmark;
                    }

                    return address.getOrDefault("city",
                            address.getOrDefault("town",
                                    address.getOrDefault("county",
                                            displayName != null ? displayName.split(",")[0] : null)));
                }
            }
        } catch (Exception e) {
            System.err.println("Nominatim City/Landmark Error: " + e.getMessage());
        }

        return null;
    }

    @Cacheable(value = "geocoding", key = "'search_' + #query.toLowerCase().trim() + '_' + #limit", unless = "#result == null")
    public List<Map<String, Object>> searchLocation(String query) {
        return searchLocation(query, 5);
    }

    public List<Map<String, Object>> searchLocation(String query, int limit) {
        rateLimitUtil.freeApiAllowed(RATE_LIMIT_KEY);

        String url = "https://nominatim.openstreetmap.org/search?" +
                "q=" + UriUtils.encodeQuery(query, StandardCharsets.UTF_8) +
                "&countrycodes=ph&format=json&limit=" + limit +
                "&addressdetails=1&bounded=1&viewbox=125.0,5.5,126.3,7.5&strict_bounds=1";

        HttpHeaders headers = new HttpHeaders();
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

    @Cacheable(value = "geocoding", key = "'citylandmark_' + #query?.toLowerCase()?.trim() + '_' + #limit", unless = "#result == null")
    public List<Map<String, Object>> searchCityOrLandmark(String query) {
        return searchCityOrLandmark(query, 5);
    }

    public List<Map<String, Object>> searchCityOrLandmark(String query, int limit) {
        rateLimitUtil.freeApiAllowed(RATE_LIMIT_KEY);

        try {
            String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
            String url = String.format(
                    "https://nominatim.openstreetmap.org/search?q=%s&format=jsonv2&addressdetails=1&limit=%d&countrycodes=ph",
                    encodedQuery, limit * 2
            );

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", userAgent);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, String.class
            );

            String json = response.getBody();
            List<Map<String, Object>> results = objectMapper.readValue(json, new TypeReference<>() {});

            if (results == null || results.isEmpty()) {
                return Collections.emptyList();
            }

            List<Map<String, Object>> filteredResults = new ArrayList<>();

            List<String> landmarkKeys = List.of(
                    "tourism", "historic", "amenity", "leisure", "attraction",
                    "camp_site", "resort", "natural", "park", "hotel", "museum"
            );

            for (Map<String, Object> result : results) {
                boolean added = false;

                String name = (String) result.get("name");
                String displayName = (String) result.get("display_name");

                if ((name != null && name.toLowerCase().contains(query.toLowerCase())) ||
                        (displayName != null && displayName.toLowerCase().contains(query.toLowerCase()))) {
                    result.put("place_type", "landmark");
                    filteredResults.add(result);
                    added = true;
                }

                if (!added && result.containsKey("address")) {
                    Map<String, Object> address = (Map<String, Object>) result.get("address");

                    if (address.containsKey("city")) {
                        result.put("place_type", "city");
                        filteredResults.add(result);
                    } else if (address.containsKey("town")) {
                        result.put("place_type", "town");
                        filteredResults.add(result);
                    } else {
                        for (String key : landmarkKeys) {
                            if (address.containsKey(key)) {
                                result.put("place_type", "landmark");
                                filteredResults.add(result);
                                break;
                            }
                        }
                    }
                }

                if (filteredResults.size() >= limit) break;
            }

            if (filteredResults.isEmpty()) {
                for (Map<String, Object> fallback : results.subList(0, Math.min(limit, results.size()))) {
                    fallback.putIfAbsent("place_type", "landmark");
                    filteredResults.add(fallback);
                }
            }

            return filteredResults;
        } catch (Exception e) {
            System.err.println("Nominatim Search Error: " + e.getMessage());
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}
