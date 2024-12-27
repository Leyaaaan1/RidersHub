package leyans.RidersHub.Controller;

import leyans.RidersHub.Repository.RoleRepository;
import leyans.RidersHub.Repository.riderRepository;
import leyans.RidersHub.model.Authority;
import leyans.RidersHub.model.Rider;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
public class SignupController {

    private final riderRepository riderRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    public SignupController(leyans.RidersHub.Repository.riderRepository riderRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
        this.riderRepository = riderRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> RegisterRider(@RequestBody Rider rider) {
        rider.setPassword(passwordEncoder.encode(rider.getPassword()));

        Authority userAuthority = roleRepository.findByName("Name");

        rider.setAuthorities(Set.of(userAuthority));
        riderRepository.save(rider);

        return ResponseEntity.ok("Rider registered successfully!");

    }
}


