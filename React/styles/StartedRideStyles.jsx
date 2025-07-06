// React/styles/StartedRideStyles.jsx
import { StyleSheet } from 'react-native';
import colors from './colors';
import utilities from './utilities';

const styles = StyleSheet.create({
    ...utilities, // Import all utility styles

    container: {
        ...utilities.containerWhite, // Use the same background as RideStep4
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.black,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        color: '#fff',
        marginLeft: 5,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 2,
    },
    headerRight: {
        width: 50,
    },
    content: {
        flex: 1,
        padding: 15,
    },
    rideInfoContainer: {
        backgroundColor: "#151515",
        borderWidth: 2,
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    rideTitle: {
        ...utilities.title,
        color: '#fff',
        fontSize: 30,
        textAlign: 'center',
        textDecorationLine: 'underline',
        marginBottom: 5,
    },
    rideId: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 2,
    },
    infoCard: {
        backgroundColor: '#151515',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#333',
    },
    infoTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    infoText: {
        color: '#ddd',
        fontSize: 14,
        lineHeight: 20,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 16,
        textAlign: 'center',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        borderWidth: 2,
        marginTop: 20,
    },
    routeCard: {
        backgroundColor: '#222',
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    routeTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        letterSpacing: 1,
    },
    routeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    routeIcon: {
        marginRight: 10,
    },
    routeText: {
        color: '#fff',
        fontSize: 16,
        flex: 1,
    },
});

export default styles;