package leyans.RidersHub.Service.Interaction;

import jakarta.persistence.EntityNotFoundException;
import leyans.RidersHub.Repository.Rides.StartedRideRepository;
import org.springframework.transaction.annotation.Transactional;
import leyans.RidersHub.Repository.Rides.RidesRepository;
import leyans.RidersHub.Utility.Rides.RiderUtil;
import leyans.RidersHub.model.Auth.Rider;
import leyans.RidersHub.model.Rides.Rides;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
public class RideParticipantService {

    private final RidesRepository ridesRepository;
    private final StartedRideRepository startedRideRepository;
    private final RiderUtil riderUtil;

    public RideParticipantService(RidesRepository ridesRepository,
                                  StartedRideRepository startedRideRepository,
                                  RiderUtil riderUtil) {
        this.ridesRepository = ridesRepository;
        this.startedRideRepository = startedRideRepository;
        this.riderUtil = riderUtil;
    }

    // Add in creation of ride
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
    public void addParticipantToRide(String generatedRidesId, String username) {
        Rides ride = riderUtil.findRideById(generatedRidesId);
        Rider rider = riderUtil.findRiderByUsername(username);

        // ✅ Add to Rides.participants
        boolean alreadyParticipant = ride.getParticipants().stream()
                .anyMatch(p -> p.getUsername().equals(rider.getUsername()));

        if (!alreadyParticipant) {
            ride.addParticipant(rider);
            ridesRepository.save(ride);
        }

        // ✅ If ride is active, also add to StartedRide.participants
        if (ride.getActive()) {
            startedRideRepository.findByRide(ride).ifPresent(startedRide -> {
                boolean alreadyInStarted = startedRide.getParticipants().stream()
                        .anyMatch(p -> p.getUsername().equals(rider.getUsername()));

                if (!alreadyInStarted) {
                    startedRide.getParticipants().add(rider);
                    startedRideRepository.save(startedRide);
                }
            });
        }
    }

    @Transactional
    public void removeParticipantFromRide(String generatedRidesId, String username) {
        Rides ride = riderUtil.findRideById(generatedRidesId);
        Rider rider = riderUtil.findRiderByUsername(username);

        // ✅ Remove from Rides
        if (ride.getParticipants() != null &&
                ride.getParticipants().stream()
                        .anyMatch(p -> p.getId().equals(rider.getId()))) {
            ride.getParticipants().remove(rider);
            ridesRepository.save(ride);
        }

        // ✅ If ride is active, also remove from StartedRide
        if (ride.getActive()) {
            startedRideRepository.findByRide(ride).ifPresent(startedRide -> {
                if (startedRide.getParticipants() != null &&
                        startedRide.getParticipants().stream()
                                .anyMatch(p -> p.getId().equals(rider.getId()))) {
                    startedRide.getParticipants().remove(rider);
                    startedRideRepository.save(startedRide);
                }
            });
        }
    }
}