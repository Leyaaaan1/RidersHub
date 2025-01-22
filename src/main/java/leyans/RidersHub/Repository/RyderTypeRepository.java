package leyans.RidersHub.Repository;

import leyans.RidersHub.model.RiderType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface RyderTypeRepository extends JpaRepository<RiderType, Integer> {

    Set<RiderType> findByNameIn(Set<String> name);

    RiderType findByName(String name);
}

