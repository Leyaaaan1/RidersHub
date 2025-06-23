package leyans.RidersHub.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import leyans.RidersHub.DTO.LocationImageDto;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class WikimediaImageService {
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private static final String WIKIMEDIA_API_BASE = "https://commons.wikimedia.org/w/api.php";

    public WikimediaImageService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public LocationImageDto getLocationImage(String locationName) {
        try {
            // Step 1: Search for images related to the location
            String searchUrl = UriComponentsBuilder.fromHttpUrl(WIKIMEDIA_API_BASE)
                    .queryParam("action", "query")
                    .queryParam("format", "json")
                    .queryParam("list", "search")
                    .queryParam("srsearch", locationName)
                    .queryParam("srnamespace", "6") // File namespace
                    .queryParam("srlimit", "1")
                    .build()
                    .toUriString();

            String searchResponse = restTemplate.getForObject(searchUrl, String.class);
            JsonNode searchJson = objectMapper.readTree(searchResponse);

            JsonNode searchResults = searchJson.path("query").path("search");
            if (!searchResults.isArray() || searchResults.size() == 0) {
                return null; // No images found
            }

            String fileName = searchResults.get(0).path("title").asText();

            // Step 2: Get image info including URL, author, and license
            String imageInfoUrl = UriComponentsBuilder.fromHttpUrl(WIKIMEDIA_API_BASE)
                    .queryParam("action", "query")
                    .queryParam("format", "json")
                    .queryParam("titles", fileName)
                    .queryParam("prop", "imageinfo")
                    .queryParam("iiprop", "url|user|extmetadata")
                    .queryParam("iiurlwidth", "800") // Get a reasonable sized image
                    .build()
                    .toUriString();

            String imageInfoResponse = restTemplate.getForObject(imageInfoUrl, String.class);
            JsonNode imageInfoJson = objectMapper.readTree(imageInfoResponse);

            JsonNode pages = imageInfoJson.path("query").path("pages");
            JsonNode page = pages.elements().next(); // Get first (and only) page
            JsonNode imageInfo = page.path("imageinfo").get(0);

            String imageUrl = imageInfo.path("thumburl").asText();
            if (imageUrl.isEmpty()) {
                imageUrl = imageInfo.path("url").asText(); // Fallback to full size if thumb not available
            }

            String author = imageInfo.path("user").asText();

            // Extract license from extmetadata
            String license = "Unknown";
            JsonNode extMetadata = imageInfo.path("extmetadata");
            if (extMetadata.has("LicenseShortName")) {
                license = extMetadata.path("LicenseShortName").path("value").asText();
            } else if (extMetadata.has("License")) {
                license = extMetadata.path("License").path("value").asText();
            }

            return new LocationImageDto(imageUrl, author, license);

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch image from Wikimedia Commons", e);
        }
    }
}