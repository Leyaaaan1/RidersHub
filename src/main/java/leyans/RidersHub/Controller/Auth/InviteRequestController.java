package leyans.RidersHub.Controller.Auth;


import leyans.RidersHub.Utility.InviteUtil;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/riders")
public class InviteRequestController {

    private final InviteUtil inviteUtil;


    public InviteRequestController(InviteUtil inviteUtil) {
        this.inviteUtil = inviteUtil;
    }


    @GetMapping("/qr-based")
    public String qrBased(Integer generatedRidesId) {
        return inviteUtil.getQrCodeUrl(generatedRidesId);

    }

    @GetMapping("/url-based")
    public String urlBased(Integer generatedRidesId) {
        return inviteUtil.getInviteLink(generatedRidesId);
    }

}
