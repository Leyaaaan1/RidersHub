package leyans.RidersHub.model;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.WKTReader;
import org.locationtech.jts.io.WKTWriter;

@Converter(autoApply = true)
public class PointConverter implements AttributeConverter<Point, String> {

    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
    private final WKTWriter wktWriter = new WKTWriter();
    private final WKTReader wktReader = new WKTReader(geometryFactory);

    @Override
    public String convertToDatabaseColumn(Point point) {
        if (point == null) {
            return null;
        }
        return "SRID=4326;" + wktWriter.write(point); // Include SRID
    }

    @Override
    public Point convertToEntityAttribute(String wkt) {
        if (wkt == null || wkt.isEmpty()) {
            return null;
        }
        try {
            if (!wkt.startsWith("SRID=4326;")) {
                wkt = "SRID=4326;" + wkt;
            }
            return (Point) wktReader.read(wkt.replace("SRID=4326;", "")); // Remove SRID before parsing
        } catch (ParseException e) {
            throw new RuntimeException("Failed to convert WKT to Point", e);
        }
    }
}
