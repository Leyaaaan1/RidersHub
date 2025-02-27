package leyans.RidersHub.Repository;

import leyans.RidersHub.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Locations, Integer> {





}
