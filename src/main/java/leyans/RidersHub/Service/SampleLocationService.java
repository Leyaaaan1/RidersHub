package leyans.RidersHub.Service;


import leyans.RidersHub.Repository.LocationRepository;
import leyans.RidersHub.model.Location;
import leyans.RidersHub.model.Rider;
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




    public List <Location> getAllLocations() {
        return locationRepository.findAll();
   }

   public Location addLocation(String locationName, String latitude, String longitude, String username) {

        Rider newRider = new Rider();

        Location newLocation = new Location();
        newLocation.setLocationName(locationName);
        newLocation.setLatitude(latitude);
        newLocation.setLongitude(longitude);
        newLocation.setRider(newRider);
        return locationRepository.save(newLocation);
    }


    }

