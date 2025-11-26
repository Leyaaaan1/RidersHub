package leyans.RidersHub.Service;


import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import leyans.RidersHub.DTO.RiderDTO;
import leyans.RidersHub.Repository.RiderTypeRepository;
import leyans.RidersHub.Repository.RidesRepository;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.RiderType;
import leyans.RidersHub.model.Rides;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import leyans.RidersHub.Repository.RiderRepository;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional
public class    RiderService {

    @Autowired
    private final RiderRepository riderRepository;
    @Autowired
    private final RiderTypeRepository riderTypeRepository;

    @Autowired
    private final PasswordEncoder passwordEncoder;




    public RiderService(RiderRepository riderRepository, RiderTypeRepository riderTypeRepository, PasswordEncoder passwordEncoder) {
        this.riderRepository = riderRepository;
        this.riderTypeRepository = riderTypeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public RiderType addRiderType(String riderTypeName) {
        RiderType riderType = new RiderType();
        riderType.setRiderType(riderTypeName);
        return riderTypeRepository.save(riderType);
    }

    public RiderType getCurrentUserRiderType(String username) {
        Rider rider = riderRepository.findByUsername(username);
        if (rider == null) {
            throw new RuntimeException("User not found");
        }
        return rider.getRiderType();
    }



    public Rider registerRider(String username, String password, String riderType) {
        Rider existingRider = riderRepository.findByUsername(username);
        if (existingRider != null) {
            throw new RuntimeException("Username already exists");
        }

        String encodedPassword = passwordEncoder.encode(password);
        RiderType riderTypeName = null;
        if (riderType != null && !riderType.isEmpty()) {
            riderTypeName = getRiderTypeByName(riderType);
        }
        Rider newRider = new Rider();
        newRider.setUsername(username);
        newRider.setPassword(encodedPassword);
        newRider.setEnabled(true);
        newRider.setRiderType(riderTypeName);

        return riderRepository.save(newRider);
    }

    public List<String> findUsernamesContaining(String username) {
        List<RiderDTO> riders = riderRepository.searchByUsername(username);
        return riders.stream()
                .map(RiderDTO::getUsername)
                .collect(Collectors.toList());
    }


    public Rider getRiderByUsername(String username) {
        Rider rider = riderRepository.findByUsername(username);
        if (rider == null) {
            throw new IllegalArgumentException("Rider not found: " + username);
        }
        return rider;
    }

    public RiderType getRiderTypeByName(String typeName) {
        RiderType type = riderTypeRepository.findByRiderType(typeName);
        if (type == null) {
            throw new IllegalArgumentException("RiderType not found: " + typeName);
        }
        return type;
    }

//    public Rides getParicipantRideById(Integer generatedRidesId) {
//
//    }
}



