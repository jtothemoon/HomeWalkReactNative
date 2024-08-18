import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput, Button } from 'react-native-paper';
import styles from './styles/loginStyles';

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async () => {
        // 서버로 로그인 요청 보내기
        try {
            const response = await fetch('https://c703-218-239-146-55.ngrok-free.app/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.status === 200) {
                const data = await response.json();
                const userId = data.userId;
                await AsyncStorage.setItem('@userId', JSON.stringify(userId)); // userId를 문자열로 변환하여 저장
                navigation.replace('Main', { userId: username });
            } else {
                const errorText = await response.text();
                setError(errorText);
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError('Failed to login');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>HomeWalk</Text>
            <TextInput
                mode="outlined"
                label="아이디"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            <TextInput
                mode="outlined"
                label="비밀번호"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
            <Button mode="contained" onPress={handleLogin} style={styles.button}>
                로그인
            </Button>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signupText}>계정이 없으신가요? 회원가입</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;
