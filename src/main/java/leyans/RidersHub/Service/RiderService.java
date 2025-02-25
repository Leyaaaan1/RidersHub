package leyans.RidersHub.Service;


import jakarta.transaction.Transactional;
import leyans.RidersHub.Config.KafkaConfig.KafkaREST.Producer.RiderProducer;
import leyans.RidersHub.DTO.RiderTypeDTO;
import leyans.RidersHub.Repository.RiderTypeRepository;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.RiderType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import leyans.RidersHub.Repository.RiderRepository;

import java.util.List;

@Service
@Transactional
public class RiderService {

    @Autowired
    private final RiderRepository riderRepository;
    @Autowired
    private final RiderTypeRepository riderTypeRepository;
    @Autowired
    private final RiderProducer riderProducer;


    public RiderService(RiderRepository riderRepository, RiderTypeRepository riderTypeRepository, RiderProducer riderProducer) {
        this.riderRepository = riderRepository;
        this.riderTypeRepository = riderTypeRepository;
        this.riderProducer = riderProducer;
    }

    public RiderType addRiderType(String riderTypeName) {
        RiderType riderType = new RiderType();
        riderType.setRiderType(riderTypeName);
        return riderTypeRepository.save(riderType);
    }

    public Rider addRider(String username, String password, Boolean enabled, String riderType) {

        RiderType riderTypeName= riderTypeRepository.findByRiderType(riderType);

        Rider newRider = new Rider();

        newRider.setUsername(username);
        newRider.setPassword(password);
        newRider.setEnabled(enabled);
        newRider.setRiderType(riderTypeName);
        return riderRepository.save(newRider);

    }

    public void sendMessageFromService(String riderType, String message) {
        // Find riderType from the database
        RiderType riderTypeEntity = riderTypeRepository.findByRiderType(riderType);



        String topic = riderTypeEntity.getRiderType();

        System.out.println("Sending message to topic: " + topic);
        riderProducer.sendMessageProducer(topic, message);
        System.out.println("Sent message: " + message + " to RiderType: " + topic);
    }

    public List<Rider> getAllRiders() {
        return riderRepository.findAll();


    }


}



