package leyans.RidersHub.Repository.Rides;

import leyans.RidersHub.model.Rides.RiderType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RiderTypeRepository extends JpaRepository<RiderType, Integer> {


    @Query("SELECT r FROM RiderType r WHERE LOWER(r.riderType) = LOWER(:riderType)")
    RiderType findByRiderType(@Param("riderType") String riderType);


}
