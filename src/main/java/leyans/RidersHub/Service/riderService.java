package leyans.RidersHub.Service;


import leyans.RidersHub.User.Rider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import leyans.RidersHub.Repository.riderRepository;

import java.util.List;
import java.util.Optional;

@Service
public class riderService {

    @Autowired
    private riderRepository riderRepository;

    public riderService(riderRepository riderRepository) {
        this.riderRepository = riderRepository;
    }

    public List<Rider> getAllRiders() {
        return riderRepository.findAll();
    }

    public Optional<Rider> getRider(Rider rider_id) {
        return  riderRepository.findById(rider_id.getRider_id());
    }

    public Rider addRider(Rider rider) {
        return riderRepository.save(rider);
    }

    public Rider updateRider(Rider rider) {
        return riderRepository.save(rider);
    }


}

