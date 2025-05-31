package leyans.RidersHub.Repository;

import leyans.RidersHub.model.Barangay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface BarangayRepository extends JpaRepository<Barangay, String> {


}
