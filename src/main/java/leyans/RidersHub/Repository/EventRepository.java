package leyans.RidersHub.Repository;

import leyans.RidersHub.model.EventRides;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<EventRides, Integer> {
}
