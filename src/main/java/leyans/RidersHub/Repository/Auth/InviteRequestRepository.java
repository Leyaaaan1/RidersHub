package leyans.RidersHub.Repository.Auth;

import leyans.RidersHub.model.Rides;
import leyans.RidersHub.model.auth.InviteRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository

public interface InviteRequestRepository extends JpaRepository <InviteRequest, Integer> {

    Optional<InviteRequest> findByInviteToken(String inviteToken);

    List<InviteRequest> findBGeneratedRidesId(Rides generatedRidesId);

    List<InviteRequest> findByRideAndStatus(Rides generatedRidesId, InviteRequest.InviteStatus status);




}
