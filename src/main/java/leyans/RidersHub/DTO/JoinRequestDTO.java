package leyans.RidersHub.DTO;

public class JoinRequestDTO {

    private Integer generatedRidesId;
    private String username;

    public Integer getGeneratedRidesId() {
        return generatedRidesId;
    }

    public void setGeneratedRidesId(Integer generatedRidesId) {
        this.generatedRidesId = generatedRidesId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
