package leyans.RidersHub.Repository;

import leyans.RidersHub.User.rider;
import org.springframework.data.jpa.repository.JpaRepository;

public interface riderRepository extends JpaRepository<rider, Integer> {
}
