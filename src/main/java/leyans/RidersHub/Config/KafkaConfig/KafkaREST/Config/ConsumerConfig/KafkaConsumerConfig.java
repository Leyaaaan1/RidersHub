package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Config.ConsumerConfig;

import leyans.RidersHub.DTO.LocationDTO;
import leyans.RidersHub.DTO.RidesDTO;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

@Configuration
public class KafkaConsumerConfig {




    public static Properties loadConfig(String filepate) {
        Properties props = new Properties();
        try (FileInputStream fis = new FileInputStream(filepate)) {
            props.load(fis);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return props;
    }


    // --- "riders"
//    @Bean
//    public ConsumerFactory<String, String> riderConsumerFactory() {
//        Map<String, Object> configProps = new HashMap<>();
//        configProps.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
//        configProps.put(ConsumerConfig.GROUP_ID_CONFIG, "riders");
//        configProps.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
//        configProps.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
//        return new DefaultKafkaConsumerFactory<>(configProps);
//    }
//    @Bean
//    public ConcurrentKafkaListenerContainerFactory<String, String> riderKafkaListenerContainerFactory() {
//        ConcurrentKafkaListenerContainerFactory<String, String> factory =
//                new ConcurrentKafkaListenerContainerFactory<>();
//        factory.setConsumerFactory(riderConsumerFactory());
//        return factory;
//    }
//
//    // --- "location-group"
//    @Bean
//    public ConsumerFactory<String, LocationDTO> locationConsumerFactory() {
//        Map<String, Object> configProps = new HashMap<>();
//        configProps.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
//        configProps.put(ConsumerConfig.GROUP_ID_CONFIG, "location-group");
//        configProps.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
//        configProps.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
//
//        JsonDeserializer<LocationDTO> deserializer = new JsonDeserializer<>(LocationDTO.class);
//        deserializer.addTrustedPackages("leyans.RidersHub.dto");
//
//        return new DefaultKafkaConsumerFactory<>(configProps, new StringDeserializer(), deserializer);
//    }
//    @Bean
//    public ConcurrentKafkaListenerContainerFactory<String, LocationDTO> locationKafkaListenerContainerFactory() {
//        ConcurrentKafkaListenerContainerFactory<String, LocationDTO> factory =
//                new ConcurrentKafkaListenerContainerFactory<>();
//        factory.setConsumerFactory(locationConsumerFactory());
//        return factory;
//    }
//


    // --- "Rides"

    @Bean
    public ConsumerFactory<String, RidesDTO> ridesCreated() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        configProps.put(ConsumerConfig.GROUP_ID_CONFIG, "rides-group");
        configProps.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        configProps.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);

        JsonDeserializer<RidesDTO> deserializer = new JsonDeserializer<>(RidesDTO.class);
        deserializer.addTrustedPackages("leyans.RidersHub.dto");

        return new DefaultKafkaConsumerFactory<>(configProps, new StringDeserializer(), deserializer);
    }


    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, RidesDTO> ridesDTOKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, RidesDTO> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(ridesCreated());
        return factory;
    }











}
