package leyans.RidersHub.DTO.Response;

public class JoinResponseDTO {

    private Integer id;
    private Integer rideId;
    private String riderUsername;

    public JoinResponseDTO() {
    }
    public JoinResponseDTO(Integer id, Integer rideId, String riderUsername) {
        this.id = id;
        this.rideId = rideId;
        this.riderUsername = riderUsername;
    }



    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getRideId() {
        return rideId;
    }

    public void setRideId(Integer rideId) {
        this.rideId = rideId;
    }

    public String getRiderUsername() {
        return riderUsername;
    }

    public void setRiderUsername(String riderUsername) {
        this.riderUsername = riderUsername;
    }


}
