package leyans.RidersHub.Controller.Auth;


import leyans.RidersHub.Utility.InviteUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/invite")
public class InviteRequestController {

    private final InviteUtil inviteUtil;


    public InviteRequestController(InviteUtil inviteUtil) {
        this.inviteUtil = inviteUtil;
    }


    @GetMapping("/{rideId}/qr-url")
    public ResponseEntity<String> getQrCodeUrl(@PathVariable Integer rideId) {
        String qrUrl = inviteUtil.getQrCodeUrlByRideId(rideId);
        return ResponseEntity.ok(qrUrl);
    }

    @GetMapping("/{rideId}/qr-base64")
    public ResponseEntity<String> getQrCodeBase64(@PathVariable Integer rideId) {
        String qrBase64 = inviteUtil.getQrCodeBase64ByRideId(rideId);
        return ResponseEntity.ok(qrBase64);
    }
}
