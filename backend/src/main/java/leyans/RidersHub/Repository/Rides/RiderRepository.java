package leyans.RidersHub.Repository.Rides;

import leyans.RidersHub.model.Auth.Rider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RiderRepository extends JpaRepository<Rider, Integer> {

    Optional<Rider> findByUsername(String username);

    Optional<Rider> findByAuthEmail(String authEmail);

    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.rider = :rider")
    int deleteByRider(@Param("rider") Rider rider);





}



