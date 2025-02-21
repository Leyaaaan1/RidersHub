package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Consumer;

import leyans.RidersHub.Config.KafkaConfig.KafkaREST.DTO.LocationDTO;
import leyans.RidersHub.model.Locations;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class LocationKafkaConsumer {

    @KafkaListener(
            topics = "location_updates",
            groupId = "location-group",
            containerFactory = "locationKafkaListenerContainerFactory"
    )
    public void listen(LocationDTO locationDTO) {
        System.out.println("Received location update: " + locationDTO.getLocationName() +
                " with point: " + locationDTO.getPoint());
    }
}
