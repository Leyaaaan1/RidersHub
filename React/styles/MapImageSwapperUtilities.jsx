import { StyleSheet } from 'react-native';

const mapImageSwapperUtilities = StyleSheet.create({
    container: {
        backgroundColor: '#000',
    },
    mapContainer: {
        backgroundColor: '#111',
        borderRadius: 8,
        overflow: 'hidden',
    },
    imageContainer: {
        position: 'relative',
    },
    mapImage: {
        width: '100%',
        height: 200,
        backgroundColor: '#222',
    },
    locationInfo: {
        backgroundColor: '#111',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#222',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#8c2323',
        marginRight: 12,
    },
    locationText: {
        flex: 1,
    },
    locationLabel: {
        color: '#666',
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 2,
        textTransform: 'capitalize',
    },
    locationName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: -0.2,
    },
    tapButton: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingVertical: 10,
        alignItems: 'center',
    },
    tapText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    noMapContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111',
        borderRadius: 8,
    },
    noMapText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default mapImageSwapperUtilities;