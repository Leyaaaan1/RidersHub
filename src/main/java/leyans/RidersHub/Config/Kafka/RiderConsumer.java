package leyans.RidersHub.Config.Kafka;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class RiderConsumer {


        @KafkaListener(topics = {"car", "motor", "bike"}, groupId = "rider-group")
        public void consume(ConsumerRecord<String, String> record) {
            String riderType = record.topic();
            String message = record.value();

            System.out.println("Received message: " + message + " for RiderType: " + riderType);
        }

        @KafkaListener(topics = "location", groupId = "rides-group")
        public void consumerNewRide() {
            System.out.println("New ride request received");
        }

        @KafkaListener(topics = "new-location", groupId = "location-group")
        public void consumerNewLocation() {
            System.out.println("New location received");
        }

    }




