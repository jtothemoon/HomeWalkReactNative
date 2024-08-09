import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import styles from './styles/loginStyles';

// 하드코딩된 사용자 정보
const users = {
    'hj': '123',
    'gy': '123',
    'gm': '123',
    'dg': '123',
    'jh': '123'
};

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async () => {
        // 하드코딩된 사용자 정보 확인
        if (users[username] && users[username] === password) {
            navigation.replace('Main', { userId: username });
            return;
        }

        // 서버로 로그인 요청 보내기
        try {
            const response = await fetch('http://192.168.91.224:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.status === 200) {
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

    const handleQuickLogin = (user) => {
        const userPassword = users[user];
        if (userPassword) {
            navigation.replace('Main', { userId: user });
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
            <Button title="Login" onPress={handleLogin} />
            <View style={styles.quickLoginContainer}>
                {Object.keys(users).map((user) => (
                    <TouchableOpacity
                        key={user}
                        style={styles.quickLoginButton}
                        onPress={() => handleQuickLogin(user)}
                    >
                        <Text style={styles.buttonText}>{user}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;
