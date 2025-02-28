package leyans.RidersHub.Kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import leyans.RidersHub.DTO.newRidesDTO;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Sinks;

@Service
public class RiderConsumer {

    private final Sinks.Many<newRidesDTO> sink;

    @Autowired
    public RiderConsumer(Sinks.Many<newRidesDTO> sink) {
        this.sink = sink;
    }

    @KafkaListener(topics = {"car", "motor", "bike"}, groupId = "rider-group")
    public void consume(ConsumerRecord<String, String> record) {
        String riderType = record.topic();
        String message = record.value();
        System.out.println("Received message: " + message + " for RiderType: " + riderType);
    }

    @KafkaListener(topics = "location", groupId = "rides-group")
    public void consumerNewRide(String message) {
        System.out.println("New ride request received: " + message);
    }

    @KafkaListener(topics = "ride-updates", groupId = "location-group")
    public void consumerRideUpdates(String message) {
        System.out.println("Ride updates received: " + message);
    }

    @KafkaListener(topics = "new-location", groupId = "location-group")
    public void listenToKafka(String message) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            newRidesDTO ridesDTO = objectMapper.readValue(message, newRidesDTO.class);
            sink.tryEmitNext(ridesDTO);
            System.out.println("Processed new ride location: " + ridesDTO.getLongitude() + ", " + ridesDTO.getLatitude());
        } catch (Exception e) {
            System.err.println("Error processing Kafka message: " + e.getMessage());
        }
    }
}
