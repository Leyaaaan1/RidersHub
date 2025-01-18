package leyans.RidersHub.Controller;

import leyans.RidersHub.Repository.riderRepository;
import leyans.RidersHub.Service.riderService;
import leyans.RidersHub.model.Rider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/rider")
public class RiderController {

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


    @PostMapping("/{rider_id}")
    public Rider gerRider(@PathVariable Integer rider_id) {
        
    }


    @PostMapping("/update")
    public ResponseEntity<Rider> updateRider(@RequestBody Rider rider) {
        Rider updatedRider = riderService.updateRider(rider);
        return  ResponseEntity.ok(updatedRider);
    }


}
