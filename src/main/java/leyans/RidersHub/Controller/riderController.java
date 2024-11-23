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
        return riderService.getAllRiders(); // Fetch all riders using the service
    }

    @PostMapping("/add")
    public ResponseEntity<Rider> addUser(@RequestBody Rider newRider) {
        Rider savedRider = riderRepository.save(newRider); // Save using the repository
        return ResponseEntity.ok(savedRider); // Return the saved Rider
    }

}
