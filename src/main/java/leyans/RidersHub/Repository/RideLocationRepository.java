package leyans.RidersHub.Repository;

import leyans.RidersHub.model.RideLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RideLocationRepository extends JpaRepository<RideLocation, Long> {

    Optional<RideLocation> findByRiderUsernameAndStarted(String username, boolean started);

    List<RideLocation> findByStarted(boolean started);

    // PostGIS query to find nearby riders using Haversine formula
    @Query(value = "SELECT rl.*, " +
            "( 6371000 * acos( cos( radians(:latitude) ) * cos( radians(rl.latitude) ) * " +
            "cos( radians(rl.longitude) - radians(:longitude) ) + sin( radians(:latitude) ) * " +
            "sin( radians(rl.latitude) ) ) ) AS distance " +
            "FROM ride_locations rl " +
            "WHERE rl.started = true " +
            "AND rl.rider_id != :riderId " +
            "HAVING distance < :radiusInMeters " +
            "ORDER BY distance",
            nativeQuery = true)
    List<RideLocation> findNearbyRiders(
            @Param("latitude") double latitude,
            @Param("longitude") double longitude,
            @Param("riderId") Long riderId,
            @Param("radiusInMeters") double radiusInMeters);

    // Find by current ride ID
    Optional<RideLocation> findByCurrentRideId(String rideId);
}
