package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Service;

import leyans.RidersHub.Config.KafkaConfig.KafkaREST.Producer.RiderProducer;
import leyans.RidersHub.DTO.RiderTypeDTO;
import leyans.RidersHub.Repository.RiderTypeRepository;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.RiderType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.util.concurrent.ListenableFutureCallback;
@Service
public class RiderProducerService {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final RiderTypeRepository riderTypeRepository;

    public RiderProducerService(KafkaTemplate<String, String> kafkaTemplate, RiderTypeRepository riderTypeRepository) {
        this.kafkaTemplate = kafkaTemplate;
        this.riderTypeRepository = riderTypeRepository;
    }



    public void sendMessage(RiderTypeDTO riderMessageDTO) {
        // Find riderType from the database
        RiderType riderTypeEntity = riderTypeRepository.findByRiderType(riderMessageDTO.getRiderType());

        if (riderTypeEntity == null) {
            throw new RuntimeException("RiderType not found: " + riderMessageDTO.getRiderType());
        }

        String topic = riderTypeEntity.getRiderType();
        String message = riderMessageDTO.getMessage();

        System.out.println("Sending message to topic: " + topic);
        kafkaTemplate.send(topic, message);
        System.out.println("Sent message: " + message + " to RiderType: " + topic);
    }



}
