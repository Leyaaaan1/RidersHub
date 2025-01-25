package leyans.RidersHub.Repository;

import leyans.RidersHub.model.Rider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RiderRepository extends JpaRepository<Rider, Integer> {

    Rider findByUsername(String username);

}



