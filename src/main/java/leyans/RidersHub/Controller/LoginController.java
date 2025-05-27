package leyans.RidersHub.Controller;
import leyans.RidersHub.Config.JWT.JwtUtil;
import leyans.RidersHub.DTO.LoginRequest;
import leyans.RidersHub.DTO.RegisterRequest;
import leyans.RidersHub.DTO.Response.LoginResponse;
import leyans.RidersHub.DTO.Response.RegisterResponse;
import leyans.RidersHub.Service.RiderService;
import leyans.RidersHub.model.Rider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
public class LoginController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RiderService riderService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            String token = jwtUtil.generateToken(loginRequest.getUsername());
            return ResponseEntity.ok(new LoginResponse(token));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest registerRequest) {
        try {
            Rider newRider = riderService.registerRider(
                    registerRequest.getUsername(),
                    registerRequest.getPassword(),
                    registerRequest.getRiderType()
            );

            String token = jwtUtil.generateToken(newRider.getUsername());
            return ResponseEntity.ok(new RegisterResponse(token, "Registration successful"));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new RegisterResponse(null, e.getMessage()));
        }
    }
}




