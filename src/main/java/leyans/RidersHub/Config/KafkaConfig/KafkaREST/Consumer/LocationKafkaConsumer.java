package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Consumer;

import leyans.RidersHub.DTO.LocationDTO;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class LocationKafkaConsumer {

    @KafkaListener(
            topics = "location_updates",
            groupId = "location-group",
            containerFactory = "locationKafkaListenerContainerFactory"
    )
    public void listen(LocationDTO locationdto) {
        System.out.println("Received location update: " + locationdto.getLocationName() +
                " with point: " + locationdto.getPoint());
    }
}
