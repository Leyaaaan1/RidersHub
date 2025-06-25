package leyans.RidersHub.Util;

import jakarta.persistence.EntityNotFoundException;
import leyans.RidersHub.Repository.RiderRepository;
import leyans.RidersHub.Repository.RidesRepository;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.Rides;
import org.springframework.stereotype.Service;

@Service
public class RiderUtil {

    private final RidesRepository ridesRepository;

    private final RiderRepository riderRepository;
    public RiderUtil(RidesRepository ridesRepository, RiderRepository riderRepository) {
        this.ridesRepository = ridesRepository;
        this.riderRepository = riderRepository;
    }

    public Rides findRideById(Integer generatedRidesId) {
        return ridesRepository.findByGeneratedRidesId(generatedRidesId)
                .orElseThrow(() -> new EntityNotFoundException("Ride not found with ID: " + generatedRidesId));
    }


    public Rider findRiderByUsername(String username) {
        Rider rider = riderRepository.findByUsername(username);
        if (rider == null) {
            throw new EntityNotFoundException("Rider not found with username: " + username);
        }
        return rider;
    }

}
