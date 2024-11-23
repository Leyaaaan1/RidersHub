package leyans.RidersHub.Service;


import leyans.RidersHub.User.Rider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import leyans.RidersHub.Repository.riderRepository;

import java.util.List;

@Service
public class riderService {

    @Autowired
    private riderRepository riderRepository;

    public List<Rider> getAllRiders() {
        return riderRepository.findAll();
    }

    public Rider addRider(Rider rider) {
        return riderRepository.save(rider);
    }

    public Rider updateRider(Rider rider) {
        return riderRepository.save(rider);
    }


//    public Rider updateRider(Rider rider) {
//        return riderRepository.save(rider);
//    }

}

