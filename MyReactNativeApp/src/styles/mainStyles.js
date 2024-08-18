import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ECEFF1', // 매우 연한 청회색 (background.default)
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: '#37474F', // 진한 청회색 (text.primary)
    fontFamily: 'GoormSansBold', // 테마에서 지정된 폰트
  },
  steps: {
    fontSize: 30,
    color: '#546E7A', // 청회색 (primary.main)
    marginBottom: 16,
    fontFamily: 'GoormSansMedium', // 테마에서 지정된 폰트
  },
  errorText: {
    color: '#EF5350', // 부드러운 빨간색 (error.main)
    marginTop: 10,
    fontFamily: 'GoormSansRegular', // 테마에서 지정된 폰트
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#546E7A', // 청회색 (primary.main)
  },
});
