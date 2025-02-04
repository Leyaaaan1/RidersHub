package leyans.RidersHub.Service.kafka;


import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class RouteEventProducer {

    private final KafkaTemplate kafkaTemplate;


    public RouteEventProducer(KafkaTemplate kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public RouteEventProducer sendRouteupdate(String routeId, String UpdatedInfo ) {
        String message = "Route: " + routeId + "Updated: " + UpdatedInfo;
        kafkaTemplate.send("Route Update", routeId, message);


          System.out.println(message);

    }
}

