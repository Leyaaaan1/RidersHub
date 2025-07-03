import {StyleSheet} from "react-native";
import colors from "./colors";

const riderPageUtils = StyleSheet.create({
    searchContainer: {
        width: '90%',
        marginVertical: 15,
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2
    },
    middleContentContainer: {
        height: '25%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:  '#f5f5f5'
    },
    contentContainer: {
        flex: 1
    },
    searchLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    searchInputContainer: {
        flexDirection: 'row',
        width: '60%',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    searchInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        color: '#333',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        backgroundColor: '#fff'
    },
    searchButton: {
        flex: 1,
        height: 40,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    errorText: {
        color: 'red',
        marginTop: 5,
        fontSize: 12
    },
    detailText: {
        color: '#666',
        marginTop: 5,
        fontSize: 12
    },
    ridesListContainer: {
        flex: 1,
        marginTop: 10,
        paddingHorizontal: 15
    }
});

export default riderPageUtils;