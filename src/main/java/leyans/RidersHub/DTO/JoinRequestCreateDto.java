package leyans.RidersHub.DTO;

public class JoinRequestCreateDto {
    private Integer rideId;
    private String username;

    public JoinRequestCreateDto() {
    }

    public Integer getRideId() {
        return rideId;
    }

    public void setRideId(Integer rideId) {
        this.rideId = rideId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}