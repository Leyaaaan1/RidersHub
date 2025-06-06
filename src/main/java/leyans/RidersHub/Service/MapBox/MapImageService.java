package leyans.RidersHub.Service.MapBox;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class MapImageService {

    private final Cloudinary cloudinary;
    private final RestTemplate restTemplate;

    @Autowired
    public MapImageService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
        this.restTemplate = new RestTemplate();


    }
    public String uploadMapImage(String mapboxImageUrl) {
        try {
            ResponseEntity<byte[]> imageResponse = restTemplate.getForEntity(mapboxImageUrl, byte[].class);

            if (imageResponse.getStatusCode().is2xxSuccessful()) {
                byte[] imageBytes = imageResponse.getBody();
                Map uploadResult = cloudinary.uploader().upload(imageBytes, ObjectUtils.asMap(
                        "resource_type", "image"
                ));

                return uploadResult.get("secure_url").toString();
            } else {
                System.err.println("Mapbox API error: " + imageResponse.getStatusCode());
            }
        } catch (Exception e) {
            System.err.println("Image upload failed: " + e.getMessage());
            e.printStackTrace(); // Add this for more detailed error information
        }
        return null;
    }
}
