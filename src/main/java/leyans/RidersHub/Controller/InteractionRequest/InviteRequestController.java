package leyans.RidersHub.Controller.InteractionRequest;


import leyans.RidersHub.Utility.ParticipantUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/invite")
public class InviteRequestController {

    private final ParticipantUtil participantUtil;


    public InviteRequestController(ParticipantUtil participantUtil) {
        this.participantUtil = participantUtil;
    }


    @GetMapping("/{rideId}/qr-url")
    public ResponseEntity<String> getQrCodeUrl(@PathVariable Integer rideId) {
        String qrUrl = participantUtil.getQrCodeUrlByRideId(rideId);
        return ResponseEntity.ok(qrUrl);
    }

    @GetMapping("/{rideId}/qr-base64")
    public ResponseEntity<String> getQrCodeBase64(@PathVariable Integer rideId) {
        String qrBase64 = participantUtil.getQrCodeBase64ByRideId(rideId);
        return ResponseEntity.ok(qrBase64);
    }

    @GetMapping("/{rideId}/invites")
    public ResponseEntity<String> getInviteUDetailsUrl(@PathVariable Integer rideId) {
        String inviteDetails = participantUtil.getInviteUrlByRideId(rideId);
        return ResponseEntity.ok(inviteDetails);
    }
}
