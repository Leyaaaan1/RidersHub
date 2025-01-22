package leyans.RidersHub.Service;


import leyans.RidersHub.Repository.AuthorityRepository;
import leyans.RidersHub.model.Authority;
import leyans.RidersHub.model.Rider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import leyans.RidersHub.Repository.RiderRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RiderService {

    @Autowired
    private RiderRepository riderRepository;

    @Autowired
    private AuthorityRepository authorityRepository;

    @Autowired
    private AuthorityService authorityService;

    public RiderService(RiderRepository riderRepository, AuthorityRepository authorityRepository, AuthorityService authorityService) {
        this.riderRepository = riderRepository;
        this.authorityRepository = authorityRepository;
        this.authorityService = authorityService;
    }

    public List<Rider> getAllRiders() {
        return riderRepository.findAll();
    }

    public Rider getRiderById(int rider_id) {
        Optional<Rider> rider = riderRepository.findById(rider_id);
        return rider.orElse(null);
    }

    public Rider addRider(Rider riderAdd) {
        // Fetch authorities
        Set<Authority> authorities = authorityService.findByName(
                riderAdd.getAuthorities()
                        .stream()
                        .map(Authority::getName)
                        .collect(Collectors.toSet())
        );

        // Ensure that authorities are found
        if (authorities.isEmpty()) {
            throw new IllegalArgumentException("Invalid authorities provided.");
        }

        // Set authorities and save the rider
        riderAdd.setAuthorities(authorities);
        return riderRepository.save(riderAdd);
    }


    public Rider updateRider(Rider rider) {
        return riderRepository.save(rider);
    }


}

