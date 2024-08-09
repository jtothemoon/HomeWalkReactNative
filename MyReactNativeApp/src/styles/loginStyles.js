import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
        color: '#000080' // Navy color
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 16,
        borderRadius: 4
    },
    errorText: {
        color: 'red',
        marginBottom: 16,
        textAlign: 'center'
    },
    quickLoginContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20
    },
    quickLoginButton: {
        backgroundColor: '#000080', // Navy color
        padding: 10,
        borderRadius: 5
    },
    buttonText: {
        color: 'white'
    },
    signupText: {
        color: '#000080', // Navy color
        marginTop: 16,
        textAlign: 'center',
        textDecorationLine: 'underline'
    }
});
