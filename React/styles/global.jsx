
import { StyleSheet } from 'react-native';
import colors from './colors';
import spacing from './spacing';

const global = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.md,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: spacing.md,
    },
    paragraph: {
        fontSize: 16,
        color: colors.text,
        marginBottom: spacing.sm,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: 8,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        textAlign: 'center',
    },
});

export default global;
