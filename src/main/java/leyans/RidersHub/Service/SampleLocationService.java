package leyans.RidersHub.Service;


import leyans.RidersHub.Repository.LocationRepository;
import leyans.RidersHub.model.Location;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.RiderType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SampleLocationService {

    @Autowired
    private LocationRepository locationRepository;

    public SampleLocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }


    public Location addLocation(String newLocationName) {
        Location newLocation = new Location();
        newLocation.setLocationName(newLocationName);
        return  locationRepository.save(newLocation);
    }

    public List <Location> getAllLocations() {
        return locationRepository.findAll();
   }








}
