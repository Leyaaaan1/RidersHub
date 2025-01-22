package leyans.RidersHub.Service;

import leyans.RidersHub.Repository.AuthorityRepository;
import leyans.RidersHub.model.Authority;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthorityService {

    @Autowired
    private AuthorityRepository authorityRepository;

    public Set<Authority> findByName(Set<String> authorityNames) {
        Set<Authority> authorities = new HashSet<>(authorityRepository.findByNameIn(authorityNames));
        if (authorities.isEmpty()) {
            throw new IllegalArgumentException("Authorities not found for the given names: " + authorityNames);
        }
        return authorities;
    }
}



