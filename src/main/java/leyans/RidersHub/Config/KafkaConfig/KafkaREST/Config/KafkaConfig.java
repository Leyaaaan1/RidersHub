package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Config;


import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;

import java.util.HashMap;
import java.util.Map;

@EnableKafka
@Configuration
public class KafkaConfig {

//    @Bean
//    public ConsumerFactory<String, String> consumerFactory() {
//
//        Map<String, Object> config = new HashMap<>();
//
//        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "192.168.1.51:9092");
//        config.put(ConsumerConfig.GROUP_ID_CONFIG, "riders");
//        config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
//        config.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
//
//        return new DefaultKafkaConsumerFactory<>(config);
//    }


    @Bean
    public ConsumerFactory<String, String> consumerFactoryGeoLocations() {
        Map<String, Object> geoLocations = new HashMap<>();

        geoLocations.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "192.168.1.51:9092");
        geoLocations.put(ConsumerConfig.GROUP_ID_CONFIG, "geo-location");
        geoLocations.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        geoLocations.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);

        return new DefaultKafkaConsumerFactory<>(geoLocations);
    }

    public ConcurrentKafkaListenerContainerFactory concurrentKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, String> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactoryGeoLocations());
        return factory;
    }




}
