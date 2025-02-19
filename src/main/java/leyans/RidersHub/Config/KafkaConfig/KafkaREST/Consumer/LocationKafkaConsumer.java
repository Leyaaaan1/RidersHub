package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Consumer;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class LocationKafkaConsumer {


    @KafkaListener(topics = "userLocations", groupId = "locations")
    public void LocationConsume(String message) {

    System.out.println("user send this shit locations: " + message);}
}
