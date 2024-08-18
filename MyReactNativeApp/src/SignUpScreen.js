import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import styles from './styles/signupStyles';

const SignUpScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleSignUp = async () => {
        if (!username || !password || !email) {
            Alert.alert('Error', 'All fields are required');
            return;
        }

        try {
            const response = await fetch('https://a64e-218-239-146-55.ngrok-free.app/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, email })
            });

            if (response.status === 201) {
                Alert.alert('Success', 'User registered successfully');
                navigation.replace('Login');
            } else {
                const errorText = await response.text();
                Alert.alert('Error', errorText);
            }
        } catch (error) {
            console.error('Error registering user:', error);
            Alert.alert('Error', 'Failed to register user');
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
            <TextInput
                mode="outlined"
                label="이메일"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
            />
            <Button mode="contained" onPress={handleSignUp} style={styles.button}>
                회원가입
            </Button>
            <Button mode="text" onPress={() => navigation.goBack()} style={styles.backButton} labelStyle={styles.backButtonText}>
                뒤로가기
            </Button>
        </View>
    );
};

export default SignUpScreen;
