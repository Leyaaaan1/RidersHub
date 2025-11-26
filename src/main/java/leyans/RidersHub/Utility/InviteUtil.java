package leyans.RidersHub.Utility;


import jakarta.persistence.EntityNotFoundException;
import leyans.RidersHub.Repository.Auth.InviteRequestRepository;
import leyans.RidersHub.Repository.RidesRepository;
import leyans.RidersHub.Service.Auth.InviteRequestService;
import leyans.RidersHub.model.Rides;
import leyans.RidersHub.model.auth.InviteRequest;
import org.springframework.stereotype.Service;

@Service
public class InviteUtil {

    private final InviteRequestService inviteRequestService;
    private final InviteRequestRepository inviteRequestRepository;
    private final RiderUtil riderUtil;

    public InviteUtil(InviteRequestService inviteRequestService, InviteRequestRepository inviteRequestRepository, RiderUtil riderUtil) {
        this.inviteRequestService = inviteRequestService;
        this.inviteRequestRepository = inviteRequestRepository;
        this.riderUtil = riderUtil;
    }

    public String getQrCodeUrl(Integer generatedRidesId) {
        Rides ride = riderUtil.findRideById(generatedRidesId);
        InviteRequest invite = inviteRequestRepository.findByRide(ride)
                .orElseThrow(() -> new EntityNotFoundException("Invite not found for ride ID: " + generatedRidesId));
        return invite.getQr();
    }

    public String getInviteLink(Integer generatedRidesId) {
        Rides ride = riderUtil.findRideById(generatedRidesId);
        InviteRequest invite = inviteRequestRepository.findByRide(ride)
                .orElseThrow(() -> new EntityNotFoundException("Invite not found for ride ID: " + generatedRidesId));
        return invite.getInviteLink();
    }


}
