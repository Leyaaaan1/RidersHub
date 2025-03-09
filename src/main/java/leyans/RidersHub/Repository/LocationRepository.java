package leyans.RidersHub.Repository;

import jakarta.transaction.Transactional;
import leyans.RidersHub.model.Dynamic.Locations;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.Rides;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Locations, Integer> {



    @Modifying
    @Transactional
    @Query("INSERT INTO Rides (locationName, ridesName, username, startingPoint, endingPoint, date, latitude, longitude) " +
            "VALUES (:locationName, :ridesName, :username,  :startingPoint, :endingPoint, :date, :latitude, :longitude)")
    void saveSelectedFields(
            @Param("locationName") String locationName,
            @Param("ridesName") String ridesName,
            @Param("username") Rider username,
            @Param("startingPoint") String startingPoint,
            @Param("endingPoint") String endingPoint,
            @Param("date") LocalDateTime date,
            @Param("latitude") Double latitude,
            @Param("longitude") Double longitude
    );
//Locations findByUsername(String username);
}