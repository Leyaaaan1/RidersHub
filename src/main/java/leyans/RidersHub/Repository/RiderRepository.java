package leyans.RidersHub.Repository;

import io.lettuce.core.dynamic.annotation.Param;
import leyans.RidersHub.DTO.RiderDTO;
import leyans.RidersHub.model.Rider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RiderRepository extends JpaRepository<Rider, Integer> {

    Rider findByUsername(String username);

    @Query("SELECT new leyans.RidersHub.DTO.RiderDTO(r.username) FROM Rider r WHERE LOWER(r.username) LIKE LOWER(CONCAT('%', :username, '%'))")
    List<RiderDTO> searchByUsername(@Param("username") String username);
    Optional<Rider> findByUsernameAfter(String username);



}



