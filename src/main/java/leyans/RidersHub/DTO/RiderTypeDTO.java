package leyans.RidersHub.DTO;

public class RiderTypeDTO {


    private String message;
    private String riderType;

    public RiderTypeDTO() {}

    public RiderTypeDTO(String message, String riderType) {
        this.message = message;
        this.riderType = riderType;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRiderType() {
        return riderType;
    }

    public void setRiderType(String riderType) {
        this.riderType = riderType;
    }
}
