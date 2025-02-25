package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Consumer;

import leyans.RidersHub.Config.KafkaConfig.KafkaREST.Config.ConsumerConfig.KafkaConsumerConfig;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.RiderType;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;
import java.util.function.Consumer;

@Service
public class RiderConsumer {


        @KafkaListener(topics = {"car", "motor", "bike"}, groupId = "rider-group")
        public void consume(ConsumerRecord<String, String> record) {
            String riderType = record.topic();  // The topic is now the rider type
            String message = record.value();  // Get the actual message

            System.out.println("Received message: " + message + " for RiderType: " + riderType);
        }
    }




