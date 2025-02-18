package leyans.RidersHub.Repository;

import leyans.RidersHub.model.RiderType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RiderTypeRepository extends JpaRepository<RiderType, Integer> {

    RiderType findByRiderType(String riderType);


}
