package leyans.RidersHub.Service;

import leyans.RidersHub.Repository.RyderTypeRepository;
import leyans.RidersHub.model.RiderType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class RyderTypeService {

    @Autowired
    private RyderTypeRepository ryderTypeRepository;

    public Set<RiderType> findByName(Set<String> RyderTypeName) {
        Set<RiderType> RyderTpe = new HashSet<>(ryderTypeRepository.findByNameIn(RyderTypeName));
        if (RyderTpe.isEmpty()) {
            throw new IllegalArgumentException("Authorities not found for the given names: " + RyderTypeName);
        }
        return RyderTpe;
    }
}



