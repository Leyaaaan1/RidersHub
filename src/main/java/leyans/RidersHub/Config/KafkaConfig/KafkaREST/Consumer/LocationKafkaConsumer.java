package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Consumer;


import com.fasterxml.jackson.databind.ObjectMapper;
import leyans.RidersHub.model.Locations;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class LocationKafkaConsumer {


    @KafkaListener(topics = "location_updates", groupId = "location-group")
    public void listen(Locations location) {
        System.out.println("Received location update: " + location.getLocationName() +
                " at " + location.getCoordinates());
    }
}

