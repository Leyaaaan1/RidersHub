package leyans.RidersHub.Controller.Auth;


import leyans.RidersHub.Service.Auth.InviteRequestService;
import leyans.RidersHub.Utility.InviteUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/invite")
public class InviteRequestController {

    private final InviteRequestService inviteRequestService;


    public InviteRequestController(InviteRequestService inviteRequestService) {
        this.inviteRequestService = inviteRequestService;
    }


    @GetMapping("/{rideId}/qr-url")
    public ResponseEntity<String> getQrCodeUrl(@PathVariable Integer rideId) {
        String qrUrl = inviteRequestService.getQrCodeUrlByRideId(rideId);
        return ResponseEntity.ok(qrUrl);
    }

    @GetMapping("/{rideId}/qr-base64")
    public ResponseEntity<String> getQrCodeBase64(@PathVariable Integer rideId) {
        String qrBase64 = inviteRequestService.getQrCodeBase64ByRideId(rideId);
        return ResponseEntity.ok(qrBase64);
    }

    @GetMapping("/{rideId}/invites")
    public ResponseEntity<String> getInviteUDetailsUrl(@PathVariable Integer rideId) {
        String inviteDetails = inviteRequestService.getInviteUrlByRideId(rideId);
        return ResponseEntity.ok(inviteDetails);
    }
}
