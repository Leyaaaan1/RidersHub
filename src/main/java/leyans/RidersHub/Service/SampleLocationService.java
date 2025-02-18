package leyans.RidersHub.Service;


import leyans.RidersHub.Repository.LocationRepository;
import leyans.RidersHub.model.Location;
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

    public Locti

    public List <Location> getAllLocations() {
        return locationRepository.findAll();
   }








}
