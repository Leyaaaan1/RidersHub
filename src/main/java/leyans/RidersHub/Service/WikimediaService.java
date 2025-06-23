package leyans.RidersHub.Service;

import leyans.RidersHub.DTO.Response.LocationImageResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class WikimediaService {

    private final RestTemplate restTemplate;

    @Value("${wikimedia.api.useragent}")
    private String userAgent;

    public WikimediaService() {
        this.restTemplate = new RestTemplate();
    }

    public List<LocationImageResponse> getLocationImages(String locationName, int limit) {
        try {
            String encodedLocationName = URLEncoder.encode(locationName, StandardCharsets.UTF_8.toString());

            // Build Wikimedia Commons API URL for search
            String apiUrl = UriComponentsBuilder.fromHttpUrl("https://commons.wikimedia.org/w/api.php")
                    .queryParam("action", "query")
                    .queryParam("generator", "search")
                    .queryParam("gsrsearch", "filetype:bitmap " + encodedLocationName)
                    .queryParam("gsrlimit", limit)
                    .queryParam("prop", "imageinfo")
                    .queryParam("iiprop", "url|extmetadata")
                    .queryParam("format", "json")
                    .build()
                    .toUriString();

            // Make API request with appropriate headers
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("User-Agent", userAgent);

            ResponseEntity<Map> response = restTemplate.getForEntity(apiUrl, Map.class);

            // Process the response to extract image URLs and metadata
            List<LocationImageResponse> results = new ArrayList<>();
            if (response.getBody() != null && response.getBody().containsKey("query")) {
                Map<String, Object> query = (Map<String, Object>) response.getBody().get("query");
                if (query.containsKey("pages")) {
                    Map<String, Object> pages = (Map<String, Object>) query.get("pages");

                    pages.values().forEach(page -> {
                        Map<String, Object> pageMap = (Map<String, Object>) page;
                        List<Map<String, Object>> imageInfos = (List<Map<String, Object>>) pageMap.get("imageinfo");

                        if (imageInfos != null && !imageInfos.isEmpty()) {
                            Map<String, Object> imageInfo = imageInfos.get(0);

                            String imageUrl = (String) imageInfo.get("url");
                            Map<String, Object> metadata = (Map<String, Object>) imageInfo.get("extmetadata");

                            String description = extractMetadataValue(metadata, "ImageDescription");
                            String author = extractMetadataValue(metadata, "Artist");
                            String license = extractMetadataValue(metadata, "License");

                            results.add(new LocationImageResponse(
                                    locationName,
                                    imageUrl,
                                    description,
                                    author,
                                    license
                            ));
                        }
                    });
                }
            }

            return results;
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve images for location: " + locationName, e);
        }
    }

    private String extractMetadataValue(Map<String, Object> metadata, String key) {
        if (metadata != null && metadata.containsKey(key)) {
            Map<String, Object> value = (Map<String, Object>) metadata.get(key);
            return value.containsKey("value") ? (String) value.get("value") : "";
        }
        return "";
    }
}