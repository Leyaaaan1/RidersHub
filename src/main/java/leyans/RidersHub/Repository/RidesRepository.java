package leyans.RidersHub.Repository;


import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.RiderType;
import leyans.RidersHub.model.Rides;
import org.locationtech.jts.geom.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RidesRepository extends JpaRepository<Rides, Integer> {


    Rides findRidesByUsername(Rider username);


    @Query(value = "SELECT * FROM event_rides WHERE username = :username ", nativeQuery = true)
    Rides findLastRideByUsername(@Param("username") String username);

//    @Query(value = "SELECT ST_Distance(:pointA, :pointB)", nativeQuery = true)
//    double calculateDistance(@Param("pointA") Point pointA, @Param("pointB") Point pointB);

    @Query(value = "SELECT ST_Distance(:pointA::geography, :pointB::geography)", nativeQuery = true)
    double calculateDistance(@Param("pointA") String pointA, @Param("pointB") String pointB);



    @Query(value = "SELECT username FROM rides WHERE ST_DistanceSphere(coordinates, ST_MakePoint(:lon, :lat)) <= 100", nativeQuery = true)
    List<String> findNearbyUsers(@Param("lat") double lat, @Param("lon") double lon);


}
