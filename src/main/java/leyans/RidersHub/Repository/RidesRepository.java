package leyans.RidersHub.Repository;

import leyans.RidersHub.model.Rides;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RidesRepository extends JpaRepository<Rides, Integer> {

    // Rides findRidesByRider(Rider rider);
}
