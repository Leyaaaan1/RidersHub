package leyans.RidersHub.Utility;


import jakarta.persistence.EntityNotFoundException;
import leyans.RidersHub.Repository.Auth.InviteRequestRepository;
import leyans.RidersHub.Repository.RidesRepository;
import leyans.RidersHub.Service.Auth.InviteRequestService;
import leyans.RidersHub.model.Rides;
import leyans.RidersHub.model.auth.InviteRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

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




    public InviteRequest findInviteByRideId(Integer generatedRidesId) {
        return inviteRequestRepository.findByRides_GeneratedRidesId(generatedRidesId)
                .orElseThrow(() -> new EntityNotFoundException("Invite not found for ride ID: " + generatedRidesId));
    }

    public void validateInviteNotExpired(InviteRequest invite) {
        if (isExpired(invite)) {
            throw new EntityNotFoundException("Invite expired for ride ID: " +
                    (invite.getRides() != null ? invite.getRides().getGeneratedRidesId() : "unknown"));
        }
    }
    public boolean isExpired(InviteRequest invite) {
        LocalDateTime now = LocalDateTime.now();
        if (invite.getExpiresAt() != null) {
            return invite.getExpiresAt().isBefore(now);
        }
        if (invite.getCreatedAt() != null) {
            return invite.getCreatedAt().plusMonths(1).isBefore(now);
        }
        throw new EntityNotFoundException("Invite missing expiration and creation time for ride ID: " +
                (invite.getRides() != null ? invite.getRides().getGeneratedRidesId() : "unknown"));
    }




}
