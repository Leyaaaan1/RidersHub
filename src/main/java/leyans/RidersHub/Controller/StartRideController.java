package leyans.RidersHub.Controller;

import leyans.RidersHub.DTO.Response.StartRideResponseDTO;
import leyans.RidersHub.Service.StartRideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rides")
public class StartRideController {

    private final StartRideService startRideService;

    @Autowired
    public StartRideController(StartRideService startRideService) {
        this.startRideService = startRideService;
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<StartRideResponseDTO> startRide(@PathVariable("id") Integer id) {
        StartRideResponseDTO started = startRideService.startRide(id);
        return ResponseEntity.ok(started);
    }
}
