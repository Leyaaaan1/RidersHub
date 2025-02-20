package leyans.RidersHub.Service;

import leyans.RidersHub.Repository.GeomesaLocationRepository;
import leyans.RidersHub.model.GeomesaLocation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.util.List;

@Service
public class GeomesaService {

    private DataStore dataStore;
    private SimpleFeatureType simpleFeatureType;


    @Autowired
    private GeomesaLocationRepository geomesaLocationRepository;

    public GeomesaService(GeomesaLocationRepository geomesaLocationRepository) {
        this.geomesaLocationRepository = geomesaLocationRepository;
    }


    public List <GeomesaLocation> getAllGeomesaLocations() {
        return geomesaLocationRepository.findAll();
    }

    public GeomesaLocation addLocation(String locationName, double latitude, double longitude, Point Location) {

    }
}
