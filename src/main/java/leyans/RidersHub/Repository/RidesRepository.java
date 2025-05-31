package leyans.RidersHub.Repository;

import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.Rides;
import org.springframework.data.jpa.repository.JpaRepository;
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


}
