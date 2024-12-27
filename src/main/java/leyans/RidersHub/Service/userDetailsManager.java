package leyans.RidersHub.Service;

import leyans.RidersHub.model.Rider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import leyans.RidersHub.Repository.riderRepository;

@Service
public class userDetailsManager implements org.springframework.security.core.userdetails.UserDetailsService{

    @Autowired
    private final riderRepository riderRepository;


    public userDetailsManager(riderRepository riderRepository ) {
        this.riderRepository = riderRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Retrieve the rider from the database
        Rider rider = riderRepository.findByUsername(username);


        // Build UserDetails object for Spring Security
        return User.builder()
                .username(rider.getUsername())
                .password(rider.getPassword())
                .authorities(rider.getAuthorities().stream()
                        .map(authority -> "ROLE" + authority.getName())
                        .toArray(String[]::new))
                .disabled(!rider.getEnabled())
                .build();
    }

}
