package leyans.RidersHub.Repository;

import leyans.RidersHub.model.Authority;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface AuthorityRepository extends JpaRepository<Authority, Integer> {

    Set<Authority> findByNameIn(Set<String> names);

    Authority findByName(String name);
}

