package leyans.RidersHub.Controller;

import leyans.RidersHub.Service.BarangayService;
import leyans.RidersHub.model.Barangay;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/location")
public class BarangayController {

    @Autowired
    private  BarangayService barangayService;

//    @GetMapping("/nearest")
//    public Barangay getNearest(@RequestParam double latitude, @RequestParam double longitude) {
//        return barangayService.findNearest(latitude, longitude);
//    }



}
