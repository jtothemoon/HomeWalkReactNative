import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#546E7A',
  },
  logo: {
    width: 150,  // 로고의 크기를 필요에 따라 조정하세요
    height: 150, // 로고의 크기를 필요에 따라 조정하세요
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',  // 폰트 색상을 흰색으로 설정
  },
  indicator: {
    marginTop: 20,
  },
});

export default styles;
