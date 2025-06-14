package leyans.RidersHub.Repository;

import leyans.RidersHub.model.RideJoinRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RideJoinRequestRepository extends JpaRepository<RideJoinRequest, Integer> {


    // Fetches all join requests made by a specific rider identified by their ID.

    Optional<RideJoinRequest> findByRide_RidesIdAndRider_Username(Integer rideId, String username);

    List<RideJoinRequest> findByRider_Username(String username);
    List<RideJoinRequest> findByRide_RidesId(Integer rideId);



}

