package leyans.RidersHub.Controller;

import leyans.RidersHub.Repository.riderRepository;
import leyans.RidersHub.Service.riderService;
import leyans.RidersHub.User.Rider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rider")
public class riderController {

    @Autowired
    private riderRepository riderRepository; // Correct naming for clarity
    @Autowired
    private riderService riderService;


    @GetMapping("/all")
    public List<Rider> getAllRiders() {
        return riderService.getAllRiders();
    }



    @PostMapping("/add")
    public ResponseEntity<Rider> addRiders(@RequestBody Rider rider) {
        Rider savedRider = riderService.addRider(rider);
        return ResponseEntity.ok(savedRider);
    }

    public ResponseEntity<Rider> updateRider(@RequestBody Rider rider) {
        Rider updatedRider = riderService.updateRider(rider);
        return  ResponseEntity.ok(updatedRider);
    }


//    @PutMapping("/update")
//    public ResponseEntity<Rider> updateriders(@RequestBody Rider updatedRider) {
//        Rider savedRider = riderService.updateRider(updatedRider);
//        return ResponseEntity.ok(savedRider);
//    }

}
