package leyans.RidersHub.Config;
import org.geotools.data.DataStore;
import org.geotools.data.DataStoreFinder;
import org.geotools.feature.simple.SimpleFeatureTypeBuilder;
import org.locationtech.geomesa.kafka.data.KafkaDataStore;
import org.opengis.feature.simple.SimpleFeatureType;

import org.springframework.context.annotation.Configuration;

@Configuration
public class GeomesaConfig {

    public static SimpleFeatureType createFeatureType() {
        SimpleFeatureTypeBuilder builder = new SimpleFeatureTypeBuilder();
        builder.setName("UserLocation");
        builder.add("userId", String.class);
        builder.add("geom", org.locationtech.jts.geom.Point.class); // Spatial data
        builder.add("timestamp", Long.class);
        return builder.buildFeatureType();
    }





}
