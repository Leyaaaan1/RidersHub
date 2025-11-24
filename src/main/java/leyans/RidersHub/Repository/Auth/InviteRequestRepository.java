package leyans.RidersHub.Repository.Auth;

import leyans.RidersHub.model.Rides;
import leyans.RidersHub.model.auth.InviteRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InviteRequestRepository extends JpaRepository<InviteRequest, Integer> {

    Optional<InviteRequest> findByInviteToken(String inviteToken);

    List<InviteRequest> findByRidesGeneratedRidesId(Rides generatedRidesId);

    List<InviteRequest> findByRidesStatus(Rides generatedRidesId, InviteRequest.InviteStatus inviteStatus);



}