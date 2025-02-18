package leyans.RidersHub.Service;


import leyans.RidersHub.Repository.LocationRepository;
import leyans.RidersHub.Repository.RiderRepository;
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
    @Autowired
    private RiderRepository riderRepository;

    public SampleLocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }




    public List <Location> getAllLocations() {
        return locationRepository.findAll();
   }

    public Location addLocation(String locationName, String latitude, String longitude, String rider) {

        Rider newRider = riderRepository.findByUsername(rider);
       Location newLocation = new Location();

        newLocation.setLocationName(locationName);
        newLocation.setLatitude(latitude);
        newLocation.setLongitude(longitude);
        newLocation.setRider(newRider);
    return locationRepository.save(newLocation);
    }


    }

