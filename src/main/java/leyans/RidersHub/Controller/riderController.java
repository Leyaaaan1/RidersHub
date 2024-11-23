package leyans.RidersHub.Controller;

import leyans.RidersHub.Service.riderService;
import leyans.RidersHub.User.Rider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/rider")
public class riderController {

    @Autowired
    private riderService riderService;


    @GetMapping("/{id}")
    public List<Rider> getAllRiders() {
        return riderService.getAllRiders();
    }

    public Rider createrider(@RequestBody Rider rider) {
        return riderService.addRider(rider);
    }

}
