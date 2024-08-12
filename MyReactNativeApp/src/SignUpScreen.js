import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import styles from './styles/signupStyles';

const SignUpScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');

    const handleSignUp = async () => {
        if (!username || !password || !age) {
            Alert.alert('Error', 'All fields are required');
            return;
        }

        try {
            const response = await fetch('http://192.168.134.31:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, age })
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
            <Text style={styles.title}>Sign Up</Text>
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
            <TextInput
                style={styles.input}
                placeholder="Age"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
            />
            <Button title="Sign Up" onPress={handleSignUp} />
            <Button title="Back" onPress={() => navigation.goBack()} color="#000080" />
        </View>
    );
};

export default SignUpScreen;
