package leyans.RidersHub.Service.Auth;

import jakarta.transaction.Transactional;
import leyans.RidersHub.Config.JWT.JwtUtil;
import leyans.RidersHub.Repository.Auth.RefreshTokenRepository;
import leyans.RidersHub.Utility.Rides.RiderUtil;
import leyans.RidersHub.model.Auth.Rider;
import leyans.RidersHub.model.Auth.RefreshToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

@Service
public class RefreshTokenService {

    private static final Logger log = LoggerFactory.getLogger(RefreshTokenService.class);

    private final RefreshTokenRepository refreshTokenRepository;
    private final RiderUtil riderUtil;
    private final JwtUtil jwtUtil;

    @Value("${jwt.refresh-expiration-ms:604800000}")
    private long refreshExpirationMs;

    @Value("${security.refresh-token.reuse-grace-seconds:30}")
    private long reuseGraceSeconds;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository,
                               RiderUtil riderUtil, JwtUtil jwtUtil) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.riderUtil = riderUtil;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public String createRefreshToken(String username) {
        Rider rider = riderUtil.findRiderByUsername(username);

        String rawToken = jwtUtil.generateRefreshToken();
        String tokenHash = jwtUtil.hashRefreshToken(rawToken);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setTokenHash(tokenHash);
        refreshToken.setRider(rider);
        refreshToken.setExpiresAt(Instant.now().plusMillis(refreshExpirationMs));
        refreshToken.setRevoked(false);

        refreshTokenRepository.save(refreshToken);
        log.debug("Refresh token created for rider: {}", username);

        return rawToken;
    }

    @Transactional
    public RefreshRotationResult rotateRefreshToken(String rawToken) {
        String tokenHash = jwtUtil.hashRefreshToken(rawToken);

        RefreshToken stored = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        if (stored.isRevoked()) {
            return handleRevokedTokenReuse(stored);
        }

        if (stored.getExpiresAt().isBefore(Instant.now())) {
            stored.setRevoked(true);
            stored.setRevokedAt(Instant.now());
            refreshTokenRepository.save(stored);
            throw new RuntimeException("Refresh token has expired");
        }

        return rotateFromStoredToken(stored);
    }

    private RefreshRotationResult handleRevokedTokenReuse(RefreshToken stored) {
        Instant revokedAt = stored.getRevokedAt();
        String replacementHash = stored.getReplacedByTokenHash();

        boolean withinGraceWindow = revokedAt != null &&
                Duration.between(revokedAt, Instant.now()).getSeconds() <= reuseGraceSeconds;

        if (withinGraceWindow && replacementHash != null) {
            Optional<RefreshToken> successor = refreshTokenRepository.findByTokenHash(replacementHash);

            boolean successorStillCurrent = successor.isPresent()
                    && !successor.get().isRevoked()
                    && successor.get().getExpiresAt().isAfter(Instant.now());

            if (successorStillCurrent) {
                log.warn("Refresh token reuse within {}s grace window for rider: {} — treating as a " +
                                "retried request after a dropped response, not an attack.",
                        reuseGraceSeconds, stored.getRider().getUsername());

                return rotateFromStoredToken(successor.get());
            }
        }

        log.warn("Revoked refresh token reuse detected outside grace window for rider: {}. Revoking all tokens.",
                stored.getRider().getUsername());
        refreshTokenRepository.revokeAllByRider(stored.getRider());
        throw new RuntimeException("Refresh token has been revoked");
    }

    private RefreshRotationResult rotateFromStoredToken(RefreshToken stored) {
        Rider rider = stored.getRider();

        String rawNewToken = jwtUtil.generateRefreshToken();
        String newTokenHash = jwtUtil.hashRefreshToken(rawNewToken);

        RefreshToken newToken = new RefreshToken();
        newToken.setTokenHash(newTokenHash);
        newToken.setRider(rider);
        newToken.setExpiresAt(Instant.now().plusMillis(refreshExpirationMs));
        newToken.setRevoked(false);
        refreshTokenRepository.save(newToken);

        stored.setRevoked(true);
        stored.setRevokedAt(Instant.now());
        stored.setReplacedByTokenHash(newTokenHash);
        refreshTokenRepository.save(stored);

        log.debug("Refresh token rotated for rider: {}", rider.getUsername());
        return new RefreshRotationResult(rider.getUsername(), rawNewToken);
    }

    @Transactional
    public void revokeAll(String username) {
        Rider rider = riderUtil.findRiderByUsername(username);
        refreshTokenRepository.revokeAllByRider(rider);
        log.debug("All refresh tokens revoked for rider: {}", username);
    }
}