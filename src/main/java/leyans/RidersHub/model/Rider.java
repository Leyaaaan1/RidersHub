package leyans.RidersHub.model;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class Rider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "riderId")
    private Integer rider_id;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "ride")
    private String ride;

    @Column(name = "enabled", nullable = false)
    private Boolean enabled;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "rider_type",
            joinColumns = @JoinColumn(name = "rider_id"),
            inverseJoinColumns = @JoinColumn(name = "rider_TypeId")
    )
    private Set<RiderType> rider_Type = new HashSet<>();

    // Constructors, Getters, Setters
    public Rider() {
    }

    public Rider(String username, String password, String ride, Boolean enabled, Set<RiderType> rider_Type) {
        this.username = username;
        this.password = password;
        this.ride = ride;
        this.enabled = enabled;
        this.rider_Type = rider_Type;
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

    public Set<RiderType> getRider_Type() {
        return rider_Type;
    }

    public void setRider_Type(Set<RiderType> ryderType) {
        this.rider_Type = ryderType;
    }
}