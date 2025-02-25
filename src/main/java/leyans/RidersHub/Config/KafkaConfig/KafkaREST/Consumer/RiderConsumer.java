package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Consumer;

import leyans.RidersHub.DTO.RiderTypeDTO;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class RiderConsumer {


    @KafkaListener(topics = "car", groupId = "rider-group")
    public void consume(RiderTypeDTO riderMessageDTO) {
        System.out.println("Received message: " + riderMessageDTO.getMessage() +
                " for RiderType: " + riderMessageDTO.getRiderType());
    }

    }





