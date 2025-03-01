package leyans.RidersHub.Config;

import leyans.RidersHub.DTO.RidesDTO;
import leyans.RidersHub.DTO.newRidesDTO;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Sinks;

@Configuration
public class SinkConfig {
    @Bean
    public Sinks.Many<newRidesDTO> ridesSink() {
        return Sinks.many().multicast().onBackpressureBuffer();
    }
}