package leyans.RidersHub.Controller.Rides;

import leyans.RidersHub.DTO.Response.Rides.RideStatusDTO;
import leyans.RidersHub.Repository.Rides.RidesRepository;
import leyans.RidersHub.Service.Rides.RideStatusService;
import leyans.RidersHub.Utility.Logger.AppLogger;
import leyans.RidersHub.model.Rides.Rides;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/status")
public class RideStatusController {

    private final RideStatusService rideStatusService;
    private final RidesRepository ridesRepository;

    public RideStatusController(RideStatusService rideStatusService,
                                RidesRepository ridesRepository) {
        this.rideStatusService = rideStatusService;
        this.ridesRepository = ridesRepository;
    }

    @GetMapping("/{generatedRidesId}")
    public ResponseEntity<RideStatusDTO> getCurrentStatus(
            @PathVariable String generatedRidesId) {

        AppLogger.info(this.getClass(), "GET currentStatus called",
                "generatedRidesId", generatedRidesId);

        boolean active = resolveActiveFlag(generatedRidesId);
        return ResponseEntity.ok(rideStatusService.getCurrentStatus(generatedRidesId, active));
    }

    @GetMapping("/{generatedRidesId}/detailed")
    public ResponseEntity<RideStatusDTO> getDetailedStatus(
            @PathVariable String generatedRidesId) {

        AppLogger.info(this.getClass(), "GET detailedStatus called",
                "generatedRidesId", generatedRidesId);

        boolean active = resolveActiveFlag(generatedRidesId);
        return ResponseEntity.ok(rideStatusService.getDetailedStatus(generatedRidesId, active));
    }

    private boolean resolveActiveFlag(String generatedRidesId) {
        return ridesRepository.findByGeneratedRidesId(generatedRidesId)
                .map(Rides::getActive)
                .map(Boolean.TRUE::equals)
                .orElse(false);
    }
}