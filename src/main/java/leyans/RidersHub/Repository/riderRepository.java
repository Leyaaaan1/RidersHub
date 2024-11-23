package leyans.RidersHub.Repository;

import leyans.RidersHub.User.Rider;
import org.springframework.data.jpa.repository.JpaRepository;

public interface riderRepository extends JpaRepository<Rider, Integer> {

}
