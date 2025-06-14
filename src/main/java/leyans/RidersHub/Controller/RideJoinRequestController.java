package leyans.RidersHub.Controller;

import leyans.RidersHub.Config.Security.SecurityUtils;
import leyans.RidersHub.DTO.JoinRequestCreateDto;
import leyans.RidersHub.DTO.Response.JoinResponseDTO;
import leyans.RidersHub.Service.RideJoinRequestService;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.Rides;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/join")
public class RideJoinRequestController {

    private final RideJoinRequestService rideJoinRequestService;

    public RideJoinRequestController(RideJoinRequestService rideJoinRequestService) {
        this.rideJoinRequestService = rideJoinRequestService;
    }

    @PostMapping("/{rideId}/join-requests")
    public ResponseEntity<JoinResponseDTO> createJoinRequest(
            @PathVariable Integer rideId) {

        ResponseEntity<?> authResponse = SecurityUtils.validateAuthentication();
        if (authResponse != null) {
            return ResponseEntity.status(authResponse.getStatusCode()).build();
        }

        String currentUsername = SecurityUtils.getCurrentUsername();

        JoinRequestCreateDto createDto = new JoinRequestCreateDto();
        createDto.setRideId(rideId);
        createDto.setUsername(currentUsername);

        JoinResponseDTO response = rideJoinRequestService.createJoinRequest(createDto);
        return ResponseEntity.ok(response);
    }

    //rideId is the id in the  ride participants table,
    @PutMapping("/{rideId}/join-requests/{username}/accept")
    public ResponseEntity<JoinResponseDTO> acceptJoinRequest(
            @PathVariable Integer rideId,
            @PathVariable String username) {

        ResponseEntity<?> authResponse = SecurityUtils.validateAuthentication();
        if (authResponse != null) {
            return ResponseEntity.status(authResponse.getStatusCode()).build();
        }

        String currentUsername = SecurityUtils.getCurrentUsername();

        JoinResponseDTO response = rideJoinRequestService.acceptJoinRequest(rideId, username, currentUsername);
        return ResponseEntity.ok(response);
    }



    @GetMapping("/{rideId}/list-requests")
    public ResponseEntity<List<JoinResponseDTO>> getJoinRequestsByOwner(@PathVariable Integer rideId) {
        ResponseEntity<?> authResponse = SecurityUtils.validateAuthentication();
        if (authResponse != null) {
            return ResponseEntity.status(authResponse.getStatusCode()).build();
        }

        String currentUsername = SecurityUtils.getCurrentUsername();
        List<JoinResponseDTO> responses = rideJoinRequestService.getJoinRequestsByOwner(rideId, currentUsername);
        return ResponseEntity.ok(responses);
    }



}

