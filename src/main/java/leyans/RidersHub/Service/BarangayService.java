package leyans.RidersHub.Service;


import leyans.RidersHub.Repository.BarangayRepository;
import leyans.RidersHub.model.Barangay;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BarangayService {

    @Autowired
    private BarangayRepository barangayRepository;



//    public Barangay findNearest(double latitude, double longitude) {
//        return barangayRepository.findNearestBarangay(latitude, longitude) // 1km range
//                .orElseThrow(() -> new RuntimeException("Not found"));
//
//    }
}
