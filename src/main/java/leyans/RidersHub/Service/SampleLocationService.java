package leyans.RidersHub.Service;


import leyans.RidersHub.Repository.LocationRepository;
import leyans.RidersHub.model.Location;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SampleLocationService {

    @Autowired
    private LocationRepository locationRepository;

    private void Location() {
        Location loc = new Location();
        loc.setLocationName("Toril");
        loc.setLocation();
    }





}
