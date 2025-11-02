package leyans.RidersHub.Repository;

import leyans.RidersHub.model.PsgcData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PsgcDataRepository extends JpaRepository<PsgcData, String> {


    List<PsgcData> findByNameIgnoreCase(String name);


}
