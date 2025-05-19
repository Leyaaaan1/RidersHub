package leyans.RidersHub.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/ride-tracker")
public class RideLocationViewController {

    @GetMapping
    public String getRideTrackerPage(Model model) {
        return "ride-location-tracker"; // This refers to the HTML template name
    }
}