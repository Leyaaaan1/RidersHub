package leyans.RidersHub.Service.MapService;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import leyans.RidersHub.DTO.LocationImageDto;
import leyans.RidersHub.Util.RateLimitUtil;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;

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

    @Cacheable(value = "locationImages", key = "#locationName.toLowerCase().trim()", condition = "false")
    public List<LocationImageDto> getLocationImage(String locationName) {
        rateLimitUtil.freeApiAllowed(RATE_LIMIT_KEY);

        try {
            String enhancedSearchTerm = enhanceSearchForMindanao(locationName);

            String searchUrl = UriComponentsBuilder.fromHttpUrl(WIKIMEDIA_API_BASE)
                    .queryParam("action", "query")
                    .queryParam("format", "json")
                    .queryParam("list", "search")
                    .queryParam("srsearch", enhancedSearchTerm)
                    .queryParam("srnamespace", "6") // File namespace
                    .queryParam("srlimit", "10") // Get more results
                    .build()
                    .toUriString();

            String searchResponse = restTemplate.getForObject(searchUrl, String.class);
            JsonNode searchJson = objectMapper.readTree(searchResponse);

            JsonNode searchResults = searchJson.path("query").path("search");
            if (!searchResults.isArray() || searchResults.size() == 0) {
                return new ArrayList<>();
            }

            List<String> fileTitles = findTopImageTitles(searchResults, 4);
            List<LocationImageDto> images = new ArrayList<>();

            for (String fileName : fileTitles) {
                String imageInfoUrl = UriComponentsBuilder.fromHttpUrl(WIKIMEDIA_API_BASE)
                        .queryParam("action", "query")
                        .queryParam("format", "json")
                        .queryParam("titles", fileName)
                        .queryParam("prop", "imageinfo")
                        .queryParam("iiprop", "url|user|extmetadata")
                        .queryParam("iiurlwidth", "800")
                        .build()
                        .toUriString();

                String imageInfoResponse = restTemplate.getForObject(imageInfoUrl, String.class);
                JsonNode imageInfoJson = objectMapper.readTree(imageInfoResponse);

                JsonNode pages = imageInfoJson.path("query").path("pages");
                JsonNode page = pages.elements().next();
                JsonNode imageInfo = page.path("imageinfo").get(0);

                String imageUrl = imageInfo.path("thumburl").asText();
                if (imageUrl.isEmpty()) {
                    imageUrl = imageInfo.path("url").asText();
                }

                String author = imageInfo.path("user").asText();

                String license = "Unknown";
                JsonNode extMetadata = imageInfo.path("extmetadata");
                if (extMetadata.has("LicenseShortName")) {
                    license = extMetadata.path("LicenseShortName").path("value").asText();
                } else if (extMetadata.has("License")) {
                    license = extMetadata.path("License").path("value").asText();
                }

                images.add(new LocationImageDto(imageUrl, author, license));
            }

            return images;

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch images from Wikimedia Commons", e);
        }
    }

    @Cacheable(value = "locationImages", key = "#locationName.toLowerCase().trim()", condition = "false")
    public List<LocationImageDto> checkCachedLocationImage(String locationName) {
        return null; // This will only return the cached value
    }

    private List<String> findTopImageTitles(JsonNode searchResults, int count) {
        List<String> titles = new ArrayList<>();
        for (JsonNode result : searchResults) {
            String title = result.path("title").asText().toLowerCase();
            String snippet = result.path("snippet").asText().toLowerCase();

            if (title.contains("map") || title.contains("logo") || title.contains("diagram") || title.contains("chart")) continue;
            if (snippet.contains("map") || snippet.contains("logo")) continue;

            titles.add(result.path("title").asText());
            if (titles.size() == count) break;
        }

        // Fill up with remaining results if needed
        if (titles.size() < count) {
            for (JsonNode result : searchResults) {
                String title = result.path("title").asText();
                if (!titles.contains(title)) {
                    titles.add(title);
                    if (titles.size() == count) break;
                }
            }
        }

        return titles;
    }

    private String enhanceSearchForMindanao(String locationName) {
        String enhanced = locationName;

        if (!locationName.toLowerCase().contains("philippines") &&
                !locationName.toLowerCase().contains("mindanao")) {
            enhanced += " Philippines";
        }

        if (isMindanaoCity(locationName)) {
            enhanced += " Mindanao";
        }

        return enhanced;
    }

    private boolean isMindanaoCity(String locationName) {
        String[] mindanaoCities = {
                "zamboanga", "dipolog", "dapitan", "pagadian", "isabela",
                "cagayan de oro", "iligan", "malaybalay", "valencia", "ozamiz",
                "tangub", "gingoog", "el salvador", "oroquieta",
                "davao", "tagum", "panabo", "mati", "digos", "samal",
                "general santos", "koronadal", "kidapawan", "tacurong",
                "butuan", "surigao", "bislig", "tandag", "cabadbaran", "bayugan",
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
}
