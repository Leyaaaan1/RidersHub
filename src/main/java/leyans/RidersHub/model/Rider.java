package leyans.RidersHub.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class Rider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "riderId")
    private Integer rider_id;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "password", nullable = false, unique = true)
    private String password;

    @Column(name = "ride", nullable = true)
    private String ride;

    @Column(name = "enabled", nullable = false)
    private Boolean enabled;


    public Rider(Integer rider_id, String username, String password, String ride, Boolean enabled) {
        this.rider_id = rider_id;
        this.username = username;
        this.password = password;
        this.ride = ride;
        this.enabled = enabled;
    }

    public Rider() {

    }

    public Integer getRider_id() {
        return rider_id;
    }

    public void setRider_id(Integer rider_id) {
        this.rider_id = rider_id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRide() {
        return ride;
    }

    public void setRide(String ride) {
        this.ride = ride;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

}
