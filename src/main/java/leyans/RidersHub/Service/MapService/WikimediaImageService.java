package leyans.RidersHub.Service.MapService;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import leyans.RidersHub.DTO.LocationImageDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;

@Service
public class WikimediaImageService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${USER_AGENT}")
    private String userAgent;

    @Value("${WIKIMEDIA_API_BASE:https://commons.wikimedia.org/w/api.php}")
    private String wikimediaApiBase;

    public WikimediaImageService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public List<LocationImageDto> getLocationImage(String locationName) {
        try {
            String enhancedSearchTerm = enhanceSearchForMindanao(locationName);

            // Create headers with User-Agent
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", userAgent);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            String searchUrl = UriComponentsBuilder.fromHttpUrl(wikimediaApiBase)
                    .queryParam("action", "query")
                    .queryParam("format", "json")
                    .queryParam("list", "search")
                    .queryParam("srsearch", enhancedSearchTerm)
                    .queryParam("srnamespace", "6") // File namespace
                    .queryParam("srlimit", "20") // Increased limit for better results
                    .queryParam("srwhat", "text") // Search in text content
                    .build()
                    .toUriString();


            ResponseEntity<String> searchResponse = restTemplate.exchange(
                    searchUrl, HttpMethod.GET, entity, String.class);

            if (searchResponse.getBody() == null) {
                return new ArrayList<>();
            }

            JsonNode searchJson = objectMapper.readTree(searchResponse.getBody());

            // Check for API errors
            if (searchJson.has("error")) {
                return new ArrayList<>();
            }

            JsonNode searchResults = searchJson.path("query").path("search");
            if (!searchResults.isArray() || searchResults.size() == 0) {
                return new ArrayList<>();
            }


            List<String> fileTitles = findTopImageTitles(searchResults, 4);
            if (fileTitles.isEmpty()) {
                return new ArrayList<>();
            }

            List<LocationImageDto> images = new ArrayList<>();

            for (String fileName : fileTitles) {
                try {
                    String imageInfoUrl = UriComponentsBuilder.fromHttpUrl(wikimediaApiBase)
                            .queryParam("action", "query")
                            .queryParam("format", "json")
                            .queryParam("titles", fileName)
                            .queryParam("prop", "imageinfo")
                            .queryParam("iiprop", "url|user|extmetadata")
                            .queryParam("iiurlwidth", "800")
                            .build()
                            .toUriString();

                    System.out.println("Fetching image info for: " + fileName);

                    ResponseEntity<String> imageInfoResponse = restTemplate.exchange(
                            imageInfoUrl, HttpMethod.GET, entity, String.class);

                    if (imageInfoResponse.getBody() == null) {
                        System.out.println("Empty response for image: " + fileName);
                        continue;
                    }

                    JsonNode imageInfoJson = objectMapper.readTree(imageInfoResponse.getBody());

                    // Check for API errors
                    if (imageInfoJson.has("error")) {
                        System.out.println("API Error for image " + fileName + ": " + imageInfoJson.get("error"));
                        continue;
                    }

                    JsonNode pages = imageInfoJson.path("query").path("pages");
                    if (!pages.elements().hasNext()) {
                        System.out.println("No page data for: " + fileName);
                        continue;
                    }

                    JsonNode page = pages.elements().next();

                    // Check if page exists (not missing)
                    if (page.has("missing")) {
                        System.out.println("Page missing for: " + fileName);
                        continue;
                    }

                    JsonNode imageInfoArray = page.path("imageinfo");
                    if (!imageInfoArray.isArray() || imageInfoArray.size() == 0) {
                        System.out.println("No image info for: " + fileName);
                        continue;
                    }

                    JsonNode imageInfo = imageInfoArray.get(0);

                    String imageUrl = imageInfo.path("thumburl").asText();
                    if (imageUrl.isEmpty()) {
                        imageUrl = imageInfo.path("url").asText();
                    }

                    if (imageUrl.isEmpty()) {
                        System.out.println("No image URL found for: " + fileName);
                        continue;
                    }

                    String author = imageInfo.path("user").asText("Unknown");

                    String license = "Unknown";
                    JsonNode extMetadata = imageInfo.path("extmetadata");
                    if (extMetadata.has("LicenseShortName")) {
                        license = extMetadata.path("LicenseShortName").path("value").asText("Unknown");
                    } else if (extMetadata.has("License")) {
                        license = extMetadata.path("License").path("value").asText("Unknown");
                    }

                    images.add(new LocationImageDto(imageUrl, author, license));
                    System.out.println("Successfully added image: " + imageUrl);

                } catch (Exception e) {
                    System.out.println("Error processing image " + fileName + ": " + e.getMessage());
                    // Continue with next image instead of failing completely
                }
            }

            System.out.println("Returning " + images.size() + " images");
            return images;

        } catch (Exception e) {
            System.out.println("Error in getLocationImage: " + e.getMessage());
            e.printStackTrace();
            // Return empty list instead of throwing exception
            return new ArrayList<>();
        }
    }

    private List<String> findTopImageTitles(JsonNode searchResults, int count) {
        List<String> titles = new ArrayList<>();

        // First pass: get high-quality images, excluding maps/logos/diagrams
        for (JsonNode result : searchResults) {
            String title = result.path("title").asText().toLowerCase();
            String snippet = result.path("snippet").asText().toLowerCase();

            // Skip unwanted content types
            if (title.contains("map") || title.contains("logo") ||
                    title.contains("diagram") || title.contains("chart") ||
                    title.contains("flag") || title.contains("coat of arms") ||
                    title.contains("seal") || title.contains("emblem")) {
                continue;
            }

            if (snippet.contains("map") || snippet.contains("logo") ||
                    snippet.contains("diagram") || snippet.contains("chart")) {
                continue;
            }

            // Prefer common image formats
            if (title.endsWith(".jpg") || title.endsWith(".jpeg") ||
                    title.endsWith(".png") || title.endsWith(".webp")) {
                titles.add(result.path("title").asText());
                if (titles.size() >= count) break;
            }
        }

        // Second pass: fill remaining slots with any suitable images
        if (titles.size() < count) {
            for (JsonNode result : searchResults) {
                String title = result.path("title").asText();
                String titleLower = title.toLowerCase();

                if (!titles.contains(title) &&
                        !titleLower.contains("map") &&
                        !titleLower.contains("logo") &&
                        !titleLower.contains("diagram")) {
                    titles.add(title);
                    if (titles.size() >= count) break;
                }
            }
        }

        return titles;
    }

    private String enhanceSearchForMindanao(String locationName) {
        String enhanced = locationName.trim();

        // Add Philippines if not already present
        if (!enhanced.toLowerCase().contains("philippines") &&
                !enhanced.toLowerCase().contains("mindanao")) {
            enhanced += " Philippines";
        }

        // Add Mindanao for specific cities
        if (isMindanaoCity(locationName)) {
            enhanced += " Mindanao";
        }

        // Add search terms that help find good images
        enhanced += " tourism city landscape";

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