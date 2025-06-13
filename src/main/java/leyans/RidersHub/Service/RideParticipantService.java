package leyans.RidersHub.Service;

import leyans.RidersHub.Repository.RiderRepository;
import leyans.RidersHub.model.Rider;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class RideParticipantService {

    private final RiderRepository riderRepository;

    public RideParticipantService(RiderRepository riderRepository) {
        this.riderRepository = riderRepository;
    }

    public List<Rider> addRiderParticipants(List<String> usernames) {
        if (usernames == null) return List.of();
        return usernames.stream()
                .map(riderRepository::findByUsername)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
}
