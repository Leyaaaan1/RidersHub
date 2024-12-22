package leyans.RidersHub.Service;

import leyans.RidersHub.User.Rider;
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

    public userDetailsManager(leyans.RidersHub.Repository.riderRepository riderRepository) {
        this.riderRepository = riderRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Rider rider = riderRepository.findByUsername(username);

        return User.builder()
                .username(rider.getUsername())
                .password(rider.getPassword())
                .roles("USER")
                .disabled(!rider.getEnabled())
                .build();


    }
}