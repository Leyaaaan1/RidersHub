package leyans.RidersHub.Repository;

import leyans.RidersHub.model.RideJoinRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RideJoinRequestRepository extends JpaRepository<RideJoinRequest, Integer> {

    // Retrieves all join requests for a specific ride identified by its ID.
    List<RideJoinRequest> findByRide_RidesId(Integer rideId);

    // Fetches all join requests made by a specific rider identified by their ID.
    List<RideJoinRequest> findByRider_Username(String username);

    // Finds a specific join request where both the ride ID and rider ID match
    Optional<RideJoinRequest> findByRide_RidesIdAndRider_Username(Integer rideId, String username);

    //retrieves all join requests with a particular status

}
