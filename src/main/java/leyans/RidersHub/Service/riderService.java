package leyans.RidersHub.Service;


import leyans.RidersHub.User.rider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import leyans.RidersHub.Repository.riderRepository;

import java.util.List;
import java.util.Optional;

@Service
public class riderService {

    @Autowired
    private riderRepository riderRepository;

    public List<rider> getAllRiders() {
        return riderRepository.findAll();
    }

    public Optional<rider> getRiderById(Integer rider_id) {
        return riderRepository.findById(rider_id);
    }
    public rider addRider(rider rider) {
        return riderRepository.save(rider);
    }

}

