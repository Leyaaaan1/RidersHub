import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import utilities from "../styles/utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthForm = ({
                      isLogin,
                      username,
                      password,
                      riderType,
                      setUsername,
                      setPassword,
                      setRiderType,
                      handleAuth,
                      toggleMode,
                      navigation
                  }) => (
    <View style={utilities.centeredContainer}>
        <Text style={utilities.title}>{isLogin ? 'Login' : 'Register'}</Text>
        <TextInput
            placeholder="Username"
            placeholderTextColor={utilities.textBlack.color}
            value={username}
            onChangeText={setUsername}
            style={[utilities.textBox, { height: 50, width: 250 }]}
            autoCapitalize="none"
        />
        <TextInput
            placeholder="Password"
            placeholderTextColor={utilities.textBlack.color}
            value={password}
            onChangeText={setPassword}
            style={[utilities.textBox, { height: 50, width: 250 }]}
            secureTextEntry
        />
        {!isLogin && (
            <TextInput
                placeholder="Rider Type"
                placeholderTextColor={utilities.textBlack.color}
                value={riderType}
                onChangeText={setRiderType}
                style={[utilities.textBox, { height: 50, width: 250 }]}
            />
        )}
        <View>
            <TouchableOpacity
                style={utilities.button}
                onPress={handleAuth}
            >
                <Text style={utilities.buttonText}>{isLogin ? 'Login' : 'Register'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleMode}>
                <Text style={{ marginTop: 30  }}>
                    {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                </Text>
            </TouchableOpacity>
        </View>
    </View>
);

const AuthScreen = ({ navigation }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [riderType, setRiderType] = useState('');

    const handleAuth = async () => {
        const url = isLogin
            ? 'http://192.168.1.51:8080/riders/login'
            : 'http://192.168.1.51:8080/riders/register';
        const body = isLogin
            ? { username, password }
            : { username, password, riderType };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const result = await response.json();

            if (response.ok) {
                // Save the token to AsyncStorage
                if (result.token) {
                    await AsyncStorage.setItem('userToken', result.token);
                    await AsyncStorage.setItem('username', username);
                    // You can store additional data in AsyncStorage as needed
                }

                Alert.alert(isLogin ? 'Login Successful' : 'Registration Successful');

                if (isLogin && username) {
                    navigation.navigate('RiderPage', {
                        username: username,
                        token: result.token,
                    });
                }
                return true;
            } else {
                Alert.alert('Error', result.message || 'Operation failed');
                return false;
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Please try again later.');
            return false;
        }
    };

    const toggleMode = () => setIsLogin((prev) => !prev);

    return (
        <AuthForm
            isLogin={isLogin}
            username={username}
            password={password}
            riderType={riderType}
            setUsername={setUsername}
            setPassword={setPassword}
            setRiderType={setRiderType}
            handleAuth={handleAuth}
            toggleMode={toggleMode}
            navigation={navigation}
        />
    );
};

export default AuthScreen;