package leyans.RidersHub.Repository.Interaction;

import org.springframework.data.repository.query.Param;
import leyans.RidersHub.model.Auth.Rider;
import leyans.RidersHub.model.Rides.StartedRide;
import leyans.RidersHub.model.participant.ParticipantLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ParticipantLocationRepository extends JpaRepository<ParticipantLocation, Integer> {

    void deleteAllByStartedRide(StartedRide startedRide);

    @Query("SELECT pl FROM ParticipantLocation pl " +
            "WHERE pl.startedRide = :startedRide AND pl.rider = :rider")
    List<ParticipantLocation> findByStartedRideAndRider(
            @Param("startedRide") StartedRide startedRide,
            @Param("rider") Rider rider);

    @Query("SELECT pl FROM ParticipantLocation pl " +
            "WHERE pl.startedRide = :startedRide " +
            "ORDER BY pl.lastUpdate DESC")
    List<ParticipantLocation> findByStartedRide(
            @Param("startedRide") StartedRide startedRide);

}
