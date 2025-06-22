package leyans.RidersHub.Controller;


import leyans.RidersHub.Service.MapService.MapHtmlService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.HttpHeaders;


@RestController
@RequestMapping("/map")
public class MapController {

    private final MapHtmlService mapHtmlService;

    public MapController(MapHtmlService mapHtmlService) {
        this.mapHtmlService = mapHtmlService;
    }


    @GetMapping("/location")
    public ResponseEntity<String> getMap(@RequestParam double lat, @RequestParam double lng, @RequestParam String label) {
        String html = mapHtmlService.generateMapHTML(lat, lng, label);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "text/html")
                .body(html);
    }

}
