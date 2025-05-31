package leyans.RidersHub.Repository;


import leyans.RidersHub.model.Rides;
import leyans.RidersHub.model.StartedRide;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StartedRideRepository extends JpaRepository<StartedRide, Integer> {

    boolean existsByRide(Rides ride);


}
