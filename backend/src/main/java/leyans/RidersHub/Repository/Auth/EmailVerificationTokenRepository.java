
package leyans.RidersHub.Repository.Auth;

import leyans.RidersHub.model.Auth.EmailVerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Integer> {
    Optional<EmailVerificationToken> findByToken(String token);
    Optional<EmailVerificationToken> findByEmail(String email);
    void deleteByEmail(String email);
}