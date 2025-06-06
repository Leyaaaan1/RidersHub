package leyans.RidersHub.Repository;

import leyans.RidersHub.model.RiderLocation;
import org.locationtech.jts.geom.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RiderLocationRepository extends JpaRepository<RiderLocation, Integer> {

    // Uses PostGIS ST_DistanceSphere for geodesic distance in meters
    @Query(value = "SELECT ST_DistanceSphere(:pointA, :pointB)", nativeQuery = true)
    double getDistanceBetweenPoints(@Param("pointA") Point pointA, @Param("pointB") Point pointB);

}