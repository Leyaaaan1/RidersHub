package leyans.RidersHub.model;

import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name = "authorities")
public class Authority {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AuthorityId")
    private Integer authoityId;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @ManyToMany(mappedBy = "authorities")
    private Set<Rider> rider;

    public Authority() {

    }
    public Authority(Integer authoityId, String name, Set<Rider> rider) {
        this.authoityId = authoityId;
        this.name = name;
        this.rider = rider;
    }

    public Integer getAuthoityId() {
        return authoityId;
    }

    public void setAuthoityId(Integer authoityId) {
        this.authoityId = authoityId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Rider> getRider() {
        return rider;
    }

    public void setRider(Set<Rider> rider) {
        this.rider = rider;
    }
}
