package leyans.RidersHub.Repository;

import leyans.RidersHub.model.PsgcData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PsgcDataRepository extends JpaRepository<PsgcData, String> {


    @Query("SELECT p FROM PsgcData p WHERE " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :barangay, '%')) AND " +
            "p.geographicLevel = 'Bgy' AND " +
            "EXISTS (SELECT c FROM PsgcData c WHERE c.psgcCode = SUBSTRING(p.psgcCode, 1, 6) " +
            "AND LOWER(c.name) LIKE LOWER(CONCAT('%', :cityMun, '%')) " +
            "AND (c.geographicLevel = 'City' OR c.geographicLevel = 'Mun')) AND " +
            "EXISTS (SELECT pr FROM PsgcData pr WHERE pr.psgcCode = SUBSTRING(p.psgcCode, 1, 4) " +
            "AND LOWER(pr.name) LIKE LOWER(CONCAT('%', :province, '%')) " +
            "AND pr.geographicLevel = 'Prov')")
    Optional<PsgcData> findByBarangayAndCityMunAndProvince(
            String barangay,
            String cityMun,
            String province
    );
    List<PsgcData> findByNameIgnoreCase(String name);


}
