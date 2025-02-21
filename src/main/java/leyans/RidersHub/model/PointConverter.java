package leyans.RidersHub.model;


import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.geotools.geometry.jts.WKBReader;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.io.WKBWriter;

import java.text.ParseException;

@Converter(autoApply = true)
public class PointConverter implements AttributeConverter<Point, byte[]> {
    @Override
    public byte[] convertToDatabaseColumn(Point attribute) {
        if (attribute == null) {
            return null;
        }
        WKBWriter writer = new WKBWriter();
        return writer.write(attribute);
    }

    @Override
    public Point convertToEntityAttribute(byte[] dbData) {
        if (dbData == null) {
            return null;
        }
        WKBReader reader = new WKBReader();
        try {
            return (Point) reader.read(dbData);
        } catch (org.locationtech.jts.io.ParseException e) {
            throw new RuntimeException("Error converting WKB to Point", e);
        }
    }
}