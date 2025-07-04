package leyans.RidersHub.Repository;


import jakarta.transaction.Transactional;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.Rides;
import leyans.RidersHub.model.StartedRide;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StartedRideRepository extends JpaRepository<StartedRide, Integer> {

    boolean existsByRide(Rides ride);


    boolean existsByUsername(Rider username);
    Optional<StartedRide> findByRideGeneratedRidesId(Integer generatedRidesId);

    @Query("SELECT sr FROM StartedRide sr WHERE sr.ride.generatedRidesId = :generatedRidesId")
    Optional<StartedRide> findByGeneratedRidesId(@Param("generatedRidesId") Integer generatedRidesId);
    @Query("SELECT sr FROM StartedRide sr WHERE sr.username.username = :username OR :username MEMBER OF sr.ride.participants")
    List<StartedRide> findByUsernameOrParticipant(@Param("username") Rider username);

}
