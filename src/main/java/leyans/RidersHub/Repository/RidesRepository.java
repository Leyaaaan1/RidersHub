package leyans.RidersHub.Repository;

import jakarta.transaction.Transactional;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.Rides;
import leyans.RidersHub.model.StartedRide;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RidesRepository extends JpaRepository<Rides, Integer> {

    // Rides findRidesByRider(Rider rider);

    @Query("SELECT r FROM Rides r LEFT JOIN FETCH r.participants WHERE r.ridesId = :rideId")
    Optional<Rides> findByIdWithParticipants(@Param("rideId") Integer rideId);


    @Query("SELECT r FROM Rides r WHERE r.ridesId = :ridesId")
    Optional<Rides> findByRidesId(@Param("ridesId") Integer ridesId);

    @Query("SELECT p FROM Rides r JOIN r.participants p WHERE r.ridesId = :rideId")
    List<Rider> findParticipantsByRideId(@Param("rideId") Integer rideId);
    @Query("SELECT COUNT(p) > 0 FROM Rides r JOIN r.participants p WHERE r.ridesId = :rideId AND p.id = :riderId")
    boolean isRiderParticipantInRide(@Param("rideId") Integer rideId, @Param("riderId") Integer riderId);

    @Query("SELECT p FROM Rides r JOIN r.participants p WHERE r.ridesId = :rideId AND p.id = :riderId")
    Optional<Rider> findRiderByIdInRide(@Param("rideId") Integer rideId, @Param("riderId") Integer riderId);
    @Query("SELECT COUNT(sr) > 0 FROM StartedRide sr WHERE sr.ride.ridesId = :rideId")
    boolean isRideStarted(@Param("rideId") Integer rideId);

    @Query("SELECT COUNT(p) FROM Rides r JOIN r.participants p WHERE r.ridesId = :rideId")
    Long countParticipantsByRideId(@Param("rideId") Integer rideId);


    // subject to change since schema is using username to rider_id
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO ride_participants (ride_id, rider_username) VALUES (:rideId, :username)", nativeQuery = true)
    void addParticipantToRide(@Param("rideId") Integer rideId, @Param("username") String username);


    @Modifying
    @Transactional
    @Query(value = "DELETE FROM ride_participants WHERE ride_id = :rideId AND rider_username = :username", nativeQuery = true)
    void removeParticipantFromRide(@Param("rideId") Integer rideId, @Param("username") String username);

}
