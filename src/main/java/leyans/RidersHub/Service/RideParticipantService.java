package leyans.RidersHub.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import leyans.RidersHub.Repository.RiderRepository;
import leyans.RidersHub.Repository.RidesRepository;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.Rides;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class RideParticipantService {

    private final RidesRepository ridesRepository;
    private final RiderRepository riderRepository;




    public RideParticipantService(RidesRepository ridesRepository, RiderRepository riderRepository) {
        this.ridesRepository = ridesRepository;

        this.riderRepository = riderRepository;
    }

    //add in creation of ride
    public List<Rider> addRiderParticipants(List<String> usernames) {
        if (usernames == null) return List.of();
        return usernames.stream()
                .map(username -> {
                    try {
                        return findRiderByUsername(username);
                    } catch (EntityNotFoundException e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
    @Transactional
    public void addParticipantToRide(Integer generatedRidesId, String username) {
        Rides ride = findRideById(generatedRidesId);

        Rider rider = findRiderByUsername(username);


        if (ride.getParticipants().stream()
                .noneMatch(p -> p.getId().equals(rider.getId()))) {
            ridesRepository.addParticipantToRide(ride.getRidesId(), rider.getId());
        }
    }

    @Transactional
    public void removeParticipantFromRide(Integer generatedRidesId, String username) {
        Rides ride = findRideById(generatedRidesId);
        Rider rider = findRiderByUsername(username);

        if (ride.getParticipants() != null &&
                ride.getParticipants().stream()
                        .anyMatch(p -> p.getId().equals(rider.getId()))) {
            ride.getParticipants().remove(rider);
            ridesRepository.save(ride);
        }
    }

//    public List<Rider> getRideParticipants(Integer generatedRidesId) {
//        Rides ride = ridesRepository.findByGeneratedRidesId(generatedRidesId)
//                .orElseThrow(() -> new EntityNotFoundException("Ride not found with ID: " + generatedRidesId));
//        return ride.getParticipants();
//    }

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
