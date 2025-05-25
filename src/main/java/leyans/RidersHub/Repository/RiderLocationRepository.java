package leyans.RidersHub.Repository;

import leyans.RidersHub.model.RiderLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RiderLocationRepository extends JpaRepository<RiderLocation, Integer> {

    // Uses PostGIS ST_DistanceSphere for geodesic distance in meters
    @Query(value = "SELECT ST_DistanceSphere(rl.location, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)) " +
            "FROM rider_locations rl WHERE rl.id = :locId", nativeQuery = true)
    double findDistanceMeters(@Param("locId") Integer locId,
                              @Param("lat") double latitude,
                              @Param("lon") double longitude);
}