package leyans.RidersHub.Repository;

import leyans.RidersHub.model.PsgcData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PsgcDataRepository extends JpaRepository<PsgcData, String> {

    List<PsgcData> findByNameIgnoreCase(String name);

}
