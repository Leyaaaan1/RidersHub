package leyans.RidersHub.Repository;

import leyans.RidersHub.model.RouteEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<RouteEvent, Integer> {
}
