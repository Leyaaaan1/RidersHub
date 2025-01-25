package leyans.RidersHub.Service;


import jakarta.transaction.Transactional;
import leyans.RidersHub.Repository.RiderTypeRepository;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.RiderType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import leyans.RidersHub.Repository.RiderRepository;

import java.util.List;

@Service
@Transactional
public class RiderService {

    @Autowired
    private final RiderRepository riderRepository;

    @Autowired
    private final RiderTypeRepository riderTypeRepository;

    public RiderService(RiderRepository riderRepository, RiderTypeRepository riderTypeRepository) {
        this.riderRepository = riderRepository;
        this.riderTypeRepository = riderTypeRepository;
    }

    public RiderType addRiderType(String riderTypeName) {
        RiderType riderType = new RiderType();
        riderType.setRiderType(riderTypeName);
        return riderTypeRepository.save(riderType);
    }

    public Rider addRider(String username, String password, Boolean enabled, String riderType) {

        RiderType riderTypeName= riderTypeRepository.findByRiderType(riderType);

        Rider newRider = new Rider();

        newRider.setUsername(username);
        newRider.setPassword(password);
        newRider.setEnabled(enabled);
        newRider.setRiderType(riderTypeName);
        return riderRepository.save(newRider);

    }


    public List<Rider> getAllRiders() {
        return riderRepository.findAll();

    }
}



