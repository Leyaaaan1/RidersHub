package leyans.RidersHub.Controller;
import leyans.RidersHub.DTO.RiderRequest;
import leyans.RidersHub.DTO.RiderTypeRequest;
import leyans.RidersHub.Repository.RiderRepository;
import leyans.RidersHub.Service.RiderService;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.RiderType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/riders")
public class RiderController {

    private final RiderService riderService;

    @Autowired
    public RiderController(RiderService riderService) {
        this.riderService = riderService;
    }


    // add type of rider with the entities of rider type
    @PostMapping("/rider-type")
    public ResponseEntity<RiderType> addRiderType(@RequestBody RiderTypeRequest request) {
        RiderType riderType = riderService.addRiderType(request.getRiderType());
        return ResponseEntity.ok(riderType);
    }

    @PostMapping("/add")
    public ResponseEntity<Rider> addRider(@RequestBody RiderRequest request) {

        Rider rider = riderService.addRider(
                request.getUsername(),
                request.getPassword(),
                request.getEnabled(),
                request.getRiderType());
        return ResponseEntity.ok(rider);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Rider>> getAllRiders() {
        List<Rider> riders = riderService.getAllRiders();
        return ResponseEntity.ok(riders);
    }
}
