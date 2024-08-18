import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#ECEFF1', // 매우 연한 청회색 (background.default)
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
        color: '#37474F', // 진한 청회색 (text.primary)
        fontFamily: 'GoormSansBold', // 테마에서 지정된 폰트
    },
    input: {
        borderWidth: 1,
        borderColor: '#78909C', // 중간 톤의 청회색 (text.secondary)
        padding: 8,
        marginBottom: 16,
        borderRadius: 4,
        backgroundColor: '#FFFFFF', // 흰색 배경 (background.paper)
        color: '#37474F', // 입력 텍스트 색상 (text.primary)
    },
    errorText: {
        color: '#EF5350', // 부드러운 빨간색 (error.main)
        marginBottom: 16,
        textAlign: 'center',
        fontFamily: 'GoormSansRegular', // 테마에서 지정된 폰트
    },
    button: {
        backgroundColor: '#546E7A', // 청회색 (primary.main)
        padding: 10,
        borderRadius: 4,
        marginTop: 16,
    },
    buttonText: {
        color: '#FFFFFF', // 흰색 텍스트 (primary.contrastText)
        textAlign: 'center',
        fontFamily: 'GoormSansMedium', // 테마에서 지정된 폰트
    },
    signupText: {
        color: '#546E7A', // 청회색 (primary.main)
        marginTop: 16,
        textAlign: 'center',
        textDecorationLine: 'underline',
        fontFamily: 'GoormSansMedium', // 테마에서 지정된 폰트
    }
});
