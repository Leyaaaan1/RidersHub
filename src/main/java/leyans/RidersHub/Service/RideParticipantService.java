package leyans.RidersHub.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import leyans.RidersHub.Repository.RiderRepository;
import leyans.RidersHub.Repository.RidesRepository;
import leyans.RidersHub.Service.Util.RiderUtil;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.Rides;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
public class RideParticipantService {

    private final RidesRepository ridesRepository;
    private final RiderRepository riderRepository;

    private final RiderUtil riderUtil;


    public RideParticipantService(RidesRepository ridesRepository, RiderRepository riderRepository, RiderUtil riderUtil) {
        this.ridesRepository = ridesRepository;

        this.riderRepository = riderRepository;
        this.riderUtil = riderUtil;
    }

    //add in creation of ride
    public List<Rider> addRiderParticipants(List<String> usernames) {
        if (usernames == null) return List.of();
        return usernames.stream()
                .map(username -> {
                    try {
                        return riderUtil.findRiderByUsername(username);
                    } catch (EntityNotFoundException e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
    @Transactional
    public void addParticipantToRide(Integer generatedRidesId, String username) {
        Rides ride = riderUtil.findRideById(generatedRidesId);

        Rider rider = riderUtil.findRiderByUsername(username);


        if (ride.getParticipants().stream()
                .noneMatch(p -> p.getId().equals(rider.getId()))) {
            ridesRepository.addParticipantToRide(ride.getRidesId(), rider.getId());
        }
    }

    @Transactional
    public void removeParticipantFromRide(Integer generatedRidesId, String username) {
        Rides ride = riderUtil.findRideById(generatedRidesId);
        Rider rider = riderUtil.findRiderByUsername(username);

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


}
