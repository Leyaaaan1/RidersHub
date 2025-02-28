package leyans.RidersHub.Repository;

import leyans.RidersHub.model.Dynamic.Locations;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.Rides;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Locations, Integer> {


//Locations findByUsername(String username);
}