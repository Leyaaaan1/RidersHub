package leyans.RidersHub.Service.Auth;


import leyans.RidersHub.Repository.Auth.JoinRequestRepository;
import leyans.RidersHub.Utility.InviteUtil;
import leyans.RidersHub.Utility.RiderUtil;
import leyans.RidersHub.model.Invite.InviteRequest;
import leyans.RidersHub.model.Invite.JoinRequest;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.Rides;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@Service
public class JoinRequestService {

    private final JoinRequestRepository joinRequestRepository;
    private final InviteUtil inviteUtil;
    private final RiderUtil riderUtil;

    public JoinRequestService(JoinRequestRepository joinRequestRepository, InviteUtil inviteUtil, RiderUtil riderUtil) {
        this.joinRequestRepository = joinRequestRepository;
        this.inviteUtil = inviteUtil;
        this.riderUtil = riderUtil;
    }


    @Transactional
    public JoinRequest joinRideByToken(String inviteToken, String username) {
        InviteRequest invite = inviteUtil.findInviteByToken(inviteToken);
        inviteUtil.validateInviteNotExpired(invite);

        Rides ride = invite.getRides();
        Rider requester = riderUtil.findRiderByUsername(username);

        joinRequestRepository.findByInviteTokenAndRequester(inviteToken, username)
                .ifPresent(existing -> {
                    throw new IllegalStateException("You already have a join request for this ride");
                });

        // Create join request
        JoinRequest joinRequest = new JoinRequest(ride, requester, inviteToken);
        return joinRequestRepository.save(joinRequest);
    }

    @Transactional;
    pu



}
