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
    searchLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    searchInputContainer: {
        flexDirection: 'row',
        width: '60%',
        alignItems: 'center',
        justifyContent: 'space-between',
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
});

export default riderPageUtils;