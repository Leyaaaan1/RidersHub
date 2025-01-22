package leyans.RidersHub.model;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "rider_Type")
public class RiderType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rider_TypeId")
    private Integer ryderTypeId;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @ManyToMany(mappedBy = "rider_Type")
    private Set<Rider> riders = new HashSet<>();

    public RiderType() {}

    public RiderType(Integer ryderTypeId, String name, Set<Rider> riders) {
        this.ryderTypeId = ryderTypeId;
        this.name = name;
        this.riders = riders;
    }

    public Integer getRyderTypeId() {
        return ryderTypeId;
    }

    public void setRyderTypeId(Integer authorityId) {
        this.ryderTypeId = authorityId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Rider> getRiders() {
        return riders;
    }

    public void setRiders(Set<Rider> riders) {
        this.riders = riders;
    }
}
