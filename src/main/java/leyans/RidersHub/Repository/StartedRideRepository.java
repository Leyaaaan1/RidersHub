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


    @Query("SELECT sr FROM StartedRide sr WHERE sr.ride.ridesId = :rideId")
    Optional<StartedRide> findByRideId(@Param("rideId") Integer rideId);

    @Query("SELECT sr FROM StartedRide sr LEFT JOIN FETCH sr.participants WHERE sr.id = :startedRideId")
    Optional<StartedRide> findByIdWithParticipants(@Param("startedRideId") Integer startedRideId);

    @Query("SELECT sr.participants FROM StartedRide sr WHERE sr.id = :startedRideId")
    List<Rider> findParticipantsByStartedRideId(@Param("startedRideId") Integer startedRideId);

    @Query("SELECT COUNT(p) > 0 FROM StartedRide sr JOIN sr.participants p WHERE sr.id = :startedRideId AND p.id = :riderId")
    boolean isRiderParticipantInStartedRide(@Param("startedRideId") Integer startedRideId, @Param("riderId") Integer riderId);

    @Query("SELECT p FROM StartedRide sr JOIN sr.participants p WHERE sr.id = :startedRideId AND p.id = :riderId")
    Optional<Rider> findRiderByIdInStartedRide(@Param("startedRideId") Integer startedRideId, @Param("riderId") Integer riderId);

    @Query("SELECT COUNT(p) FROM StartedRide sr JOIN sr.participants p WHERE sr.id = :startedRideId")
    Long countParticipantsByStartedRideId(@Param("startedRideId") Integer startedRideId);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO started_ride_participants (started_ride_id, rider_username) VALUES (:startedRideId, :username)", nativeQuery = true)
    void addParticipantToStartedRide(@Param("startedRideId") Integer startedRideId, @Param("username") String username);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM started_ride_participants WHERE started_ride_id = :startedRideId AND rider_username = :username", nativeQuery = true)
    void removeParticipantFromStartedRide(@Param("startedRideId") Integer startedRideId, @Param("username") String username);


}
