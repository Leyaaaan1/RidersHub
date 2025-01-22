package leyans.RidersHub.Service;


import leyans.RidersHub.Repository.RyderTypeRepository;
import leyans.RidersHub.model.RiderType;
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
    private RyderTypeRepository authorityRepository;

    @Autowired
    private RyderTypeService ryderTypeService;

    public RiderService(RiderRepository riderRepository, RyderTypeRepository ryderTypeRepository, RyderTypeService ryderTypeService) {
        this.riderRepository = riderRepository;
        this.authorityRepository = ryderTypeRepository;
        this.ryderTypeService = ryderTypeService;
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
        Set<RiderType> authorities = ryderTypeService.findByName(
                riderAdd.getRider_Type()
                        .stream()
                        .map(RiderType::getName)
                        .collect(Collectors.toSet())
        );

        // Ensure that authorities are found
        if (authorities.isEmpty()) {
            throw new IllegalArgumentException("Invalid authorities provided.");
        }

        // Set authorities and save the rider
        riderAdd.setRider_Type(authorities);
        return riderRepository.save(riderAdd);
    }


    public Rider updateRider(Rider rider) {
        return riderRepository.save(rider);
    }


}

