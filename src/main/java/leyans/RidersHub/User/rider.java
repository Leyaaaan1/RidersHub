package leyans.RidersHub.User;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "rider")
public class rider {

    @Id
    private Integer rider_id;
    private String name;
    private String ride;


}
