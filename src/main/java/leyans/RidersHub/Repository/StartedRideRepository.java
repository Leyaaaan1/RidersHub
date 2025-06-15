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


    @Query("SELECT sr FROM StartedRide sr WHERE sr.ride.generatedRidesId = :generatedRidesId")
    Optional<StartedRide> findByGeneratedRidesId(@Param("generatedRidesId") Integer generatedRidesId);

//    @Query("SELECT CASE WHEN COUNT(sr) > 0 THEN true ELSE false END FROM StartedRide sr " +
//            "JOIN sr.ride r JOIN r.participants p " +
//            "WHERE r.generatedRidesId = :generatedRidesId AND p = :rider")
//    boolean existsByGeneratedRidesIdAndParticipantsContaining(@Param("generatedRidesId") Integer generatedRidesId, @Param("rider") Rider rider);
//


}
