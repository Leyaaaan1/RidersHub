package leyans.RidersHub.Repository;

import leyans.RidersHub.model.Rider;
import org.springframework.data.jpa.repository.JpaRepository;

public interface riderRepository extends JpaRepository<Rider, Integer> {

    Rider findByUsername(String username);

}



