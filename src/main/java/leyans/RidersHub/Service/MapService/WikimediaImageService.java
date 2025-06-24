package leyans.RidersHub.Service.MapService;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import leyans.RidersHub.DTO.LocationImageDto;
import leyans.RidersHub.Service.Util.RateLimitUtil;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class WikimediaImageService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;


    private final RateLimitUtil rateLimitUtil;
    private static final String WIKIMEDIA_API_BASE = "https://commons.wikimedia.org/w/api.php";
    private static final String RATE_LIMIT_KEY = "wikimedia_api";

    public WikimediaImageService(RateLimitUtil rateLimitUtil) {
        this.rateLimitUtil = rateLimitUtil;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    @Cacheable(value = "locationImages", key = "#locationName.toLowerCase()")
    public LocationImageDto getLocationImage(String locationName) {
        // Check rate limit before making API call
        rateLimitUtil.enforceRateLimit(RATE_LIMIT_KEY);

        try {
            // Step 1: Search for images related to the location
            // Enhanced search for Mindanao locations
            String enhancedSearchTerm = enhanceSearchForMindanao(locationName);

            String searchUrl = UriComponentsBuilder.fromHttpUrl(WIKIMEDIA_API_BASE)
                    .queryParam("action", "query")
                    .queryParam("format", "json")
                    .queryParam("list", "search")
                    .queryParam("srsearch", enhancedSearchTerm)
                    .queryParam("srnamespace", "6") // File namespace
                    .queryParam("srlimit", "3") // Get more results to have better options
                    .queryParam("prop", "imageinfo")
                    .queryParam("iiprop", "url|user|extmetadata|size|mime|timestamp")
                    .queryParam("iiurlwidth", "800") // Get a reasonable sized image
                    .build()
                    .toUriString();

            String searchResponse = restTemplate.getForObject(searchUrl, String.class);
            JsonNode searchJson = objectMapper.readTree(searchResponse);

            JsonNode searchResults = searchJson.path("query").path("search");
            if (!searchResults.isArray() || searchResults.size() == 0) {
                return null; // No images found
            }

            // Find the best image from results (prefer non-maps, non-logos)
            String fileName = findBestImageFromResults(searchResults);

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

    private String enhanceSearchForMindanao(String locationName) {
        // Add context for better Mindanao location searches
        String enhanced = locationName;

        // Add Philippines context if not already specified
        if (!locationName.toLowerCase().contains("philippines") &&
                !locationName.toLowerCase().contains("mindanao")) {
            enhanced += " Philippines";
        }

        // Common Mindanao location enhancements
        if (isMindanaoCity(locationName)) {
            enhanced += " Mindanao";
        }

        return enhanced;
    }

    private boolean isMindanaoCity(String locationName) {
        String[] mindanaoCities = {
                // Zamboanga Peninsula (Region IX)
                "zamboanga", "dipolog", "dapitan", "pagadian", "isabela",
                // Northern Mindanao (Region X)
                "cagayan de oro", "iligan", "malaybalay", "valencia", "ozamiz",
                "tangub", "gingoog", "el salvador", "oroquieta",
                // Davao Region (Region XI)
                "davao", "tagum", "panabo", "mati", "digos", "samal",
                // SOCCSKSARGEN (Region XII)
                "general santos", "koronadal", "kidapawan", "tacurong",
                // Caraga Region (Region XIII)
                "butuan", "surigao", "bislig", "tandag", "cabadbaran", "bayugan",
                // BARMM
                "cotabato", "marawi", "lamitan"
        };

        String lowerLocation = locationName.toLowerCase();
        for (String city : mindanaoCities) {
            if (lowerLocation.contains(city)) {
                return true;
            }
        }
        return false;
    }

    private String findBestImageFromResults(JsonNode searchResults) {
        // Prefer actual photos over maps, logos, or diagrams
        for (JsonNode result : searchResults) {
            String title = result.path("title").asText().toLowerCase();
            String snippet = result.path("snippet").asText().toLowerCase();

            // Skip maps, logos, diagrams
            if (title.contains("map") || title.contains("logo") ||
                    title.contains("diagram") || title.contains("chart") ||
                    snippet.contains("map") || snippet.contains("logo")) {
                continue;
            }

            // Prefer images with photo-like extensions or descriptions
            if (title.contains(".jpg") || title.contains(".jpeg") ||
                    title.contains(".png") || snippet.contains("photo") ||
                    snippet.contains("view") || snippet.contains("building")) {
                return result.path("title").asText();
            }
        }

        // If no preferred image found, return the first one
        return searchResults.get(0).path("title").asText();
    }
}