package leyans.RidersHub.model.auth;


import jakarta.persistence.*;

@Entity
@Table(name = "invite_request")
public class InviteRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

     


}
