package leyans.RidersHub.Controller;


import leyans.RidersHub.DTO.newRidesDTO;
import leyans.RidersHub.Service.DynamicLocations;
import org.springframework.http.MediaType;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

@RestController
public class DynamicLocationController {

    private final DynamicLocations dynamicLocations;
    private final Sinks.Many<newRidesDTO> sink;


    public DynamicLocationController( DynamicLocations dynamicLocations, Sinks.Many<newRidesDTO> sink) {
        this.dynamicLocations = dynamicLocations;
        this.sink = sink;

    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<newRidesDTO> streamUpdates() {
        System.out.println("Stream updates real-time updates...");
        return sink.asFlux();
    }

    @PostMapping("/update")
    public void updateRide(@RequestBody newRidesDTO newRidesDTO) {
        dynamicLocations.newLocationUpdate(newRidesDTO);
        System.out.println("📡 Received update from " + newRidesDTO.getUsername());
        System.out.println("📡 Location: " + newRidesDTO.getLocationName());
        System.out.println("📡 Latitude: " + newRidesDTO.getLatitude());
        System.out.println("📡 Longitude: " + newRidesDTO.getLongitude());
        System.out.println("📡 Distance: " + newRidesDTO.getDistance());

    }

    @KafkaListener(topics = "new-location", groupId = "location-group")
    public void listenToKafka(newRidesDTO newRidesDTO) {
        sink.tryEmitNext(newRidesDTO); // Push updates to SSE clients

    }






}
