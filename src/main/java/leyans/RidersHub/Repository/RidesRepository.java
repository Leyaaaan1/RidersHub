package leyans.RidersHub.Repository;


import leyans.RidersHub.model.Dynamic.Locations;
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

//    @Query(value = """
//        SELECT * FROM locations
//        ORDER BY ST_Distance(
//            ST_SetSRID(ST_MakePoint(longitude, latitude), 4326),
//            ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
//        )
//        LIMIT 1
//    """, nativeQuery = true)
//    Locations findClosestLocation(@Param("latitude") double latitude, @Param("longitude") double longitude);


    @Query(value = "SELECT * FROM event_rides WHERE username = :username ", nativeQuery = true)
    Rides findLastRideByUsername(@Param("username") String username);

//    @Query(value = "SELECT ST_Distance(:pointA, :pointB)", nativeQuery = true)
//    double calculateDistance(@Param("pointA") Point pointA, @Param("pointB") Point pointB);



    @Query(value = "SELECT username FROM rides WHERE ST_DistanceSphere(coordinates, ST_MakePoint(:lon, :lat)) <= 100", nativeQuery = true)
    List<String> findNearbyUsers(@Param("lat") double lat, @Param("lon") double lon);


    @Query(value = """
        SELECT ST_DistanceSphere(
            ST_MakePoint(:lon1, :lat1), 
            ST_MakePoint(:lon2, :lat2)
        ) 
    """, nativeQuery = true)
    double findClosestLocation(@Param("lat1") double lat1,
                               @Param("lon1") double lon1,
                               @Param("lat2") double lat2,
                               @Param("lon2") double lon2);
}