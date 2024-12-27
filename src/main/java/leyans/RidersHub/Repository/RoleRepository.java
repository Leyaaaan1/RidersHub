package leyans.RidersHub.Repository;

import leyans.RidersHub.model.Authority;
import leyans.RidersHub.model.Rider;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Authority, Integer> {

    Authority findByName(String name);

}
