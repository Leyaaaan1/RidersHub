package leyans.RidersHub.model;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.WKTReader;
import org.locationtech.jts.io.WKTWriter;

@Converter(autoApply = true)
public class PointConverter implements AttributeConverter<Point, String> {

    private final GeometryFactory geometryFactory = new GeometryFactory();
    private final WKTWriter wktWriter = new WKTWriter();
    private final WKTReader wktReader = new WKTReader(geometryFactory);

    @Override
    public String convertToDatabaseColumn(Point point) {
        if (point == null) {
            return null;
        }
        return wktWriter.write(point); // Converts Point to WKT format
    }

    @Override
    public Point convertToEntityAttribute(String wkt) {
        if (wkt == null || wkt.isEmpty()) {
            return null;
        }
        try {
            return (Point) wktReader.read(wkt); // Converts WKT back to Point
        } catch (ParseException e) {
            throw new RuntimeException("Failed to convert WKT to Point", e);
        }
    }
}
