package leyans.RidersHub.Repository.Auth;


import jakarta.transaction.Transactional;
import leyans.RidersHub.model.Auth.Rider;
import leyans.RidersHub.model.Auth.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;
@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByTokenHash(String tokenHash);

    @Modifying
    @Transactional
    @Query("UPDATE RefreshToken t SET t.revoked = true WHERE t.rider = :rider")
    void revokeAllByRider(Rider rider);


    @Modifying
    @Transactional
    @Query("DELETE FROM RefreshToken t WHERE t.rider = :rider")
    int deleteAllByRider(@Param("rider") Rider rider);
    @Modifying
    @Transactional
    @Query("DELETE FROM RefreshToken t WHERE t.expiresAt < :now OR t.revoked = true")
    void deleteExpiredAndRevoked(Instant now);


}