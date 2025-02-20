package leyans.RidersHub.Repository;

import leyans.RidersHub.model.GeomesaLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GeomesaLocationRepository extends JpaRepository<GeomesaLocation, Integer> {

}
