package leyans.RidersHub.Repository;

import jakarta.transaction.Transactional;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.Rides;
import leyans.RidersHub.model.StartedRide;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    Optional<Rides> findByGeneratedRidesId(Integer generatedRidesId);


    Page<Rides> findAll(Pageable pageable);

    List<Rides> findByUsername_Username(String username);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO ride_participants (ride_id, rider_username) VALUES (:rideId, :riderId)", nativeQuery = true)
    void addParticipantToRide(@Param("rideId") Integer rideId, @Param("riderId") Integer riderId);

}
