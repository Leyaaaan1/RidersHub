package leyans.RidersHub.Repository.Auth;


import leyans.RidersHub.model.Invite.JoinRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JoinRequestRepository extends JpaRepository<JoinRequest, Integer>  {

    @Query("SELECT j FROM JoinRequest j WHERE j.inviteToken = :inviteToken AND j.requester.username = :username")
    Optional<JoinRequest> findByInviteTokenAndRequester(@Param("inviteToken") String inviteToken, @Param("username") String username);

    @Query("SELECT j FROM JoinRequest j WHERE j.generatedRidesId.generatedRidesId = :rideId")
    List<JoinRequest> findByRideId(@Param("generatedRidesId") Integer generatedRidesId);

    @Query("SELECT j FROM JoinRequest j WHERE j.generatedRidesId.generatedRidesId = :rideId AND j.joinStatus = :status")
    List<JoinRequest> findByRideIdAndStatus(@Param("generatedRidesId") Integer generatedRidesId,
                                            @Param("status") JoinRequest.JoinStatus status);

    @Query("SELECT j FROM JoinRequest j WHERE j.requester.username = :username")
    List<JoinRequest> findByRequester(@Param("username") String username);

}
