import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import InputUtilities from '../styles/InputUtilities';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser } from '../services/authService';
import { BASE_URL  } from '@env';

const AuthForm = ({
                      isLogin,
                      username,
                      password,
                      riderType,
                      setUsername,
                      setPassword,
                      setRiderType,
                      handleAuth,
/*
                      handleFacebookLogin,
*/
                      toggleMode,
                      navigation,
                  }) => (
    <View style={InputUtilities.authContainer}>
        <Text style={InputUtilities.authTitle}>{isLogin ? 'Login' : 'Register'}</Text>

        <TextInput
            placeholder="Username"
            placeholderTextColor="#64748b"
            value={username}
            onChangeText={setUsername}
            style={InputUtilities.authInput}
            autoCapitalize="none"
        />

        <TextInput
            placeholder="Password"
            placeholderTextColor="#64748b"
            value={password}
            onChangeText={setPassword}
            style={InputUtilities.authInput}
            secureTextEntry
        />

        {!isLogin && (
            <TextInput
                placeholder="Rider Type"
                placeholderTextColor="#64748b"
                value={riderType}
                onChangeText={setRiderType}
                style={InputUtilities.authInput}
            />
        )}

        <View style={InputUtilities.authButtonsContainer}>
            <TouchableOpacity
                style={InputUtilities.authButton}
                onPress={handleAuth}
            >
                <Text style={InputUtilities.buttonText}>
                    {isLogin ? 'Login' : 'Register'}
                </Text>
            </TouchableOpacity>

            {/* Facebook Login Button - Only show on login */}
            {isLogin && (
                <TouchableOpacity
                    style={[InputUtilities.authButton, { backgroundColor: '#1877F2' }]}
/*
                    onPress={handleFacebookLogin}
*/
                >
                    <Text style={InputUtilities.buttonText}>
                        Continue with Facebook
                    </Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity
                style={InputUtilities.authToggleButton}
                onPress={toggleMode}
            >
                <Text style={InputUtilities.authToggleText}>
                    {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
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


    const API_BASE_URL = BASE_URL  || 'http://localhost:8080';
    console.log(API_BASE_URL);
    // Regular username/password auth
    const handleAuth = async () => {
        try {
            const result = isLogin
                ? await loginUser(username, password)
                : await registerUser(username, password, riderType);

            if (result.success) {
                if (result.data.token) {
                    await AsyncStorage.setItem('userToken', result.data.token);
                    await AsyncStorage.setItem('username', username);
                }

                Alert.alert(isLogin ? 'Login Successful' : 'Registration Successful');

                if (isLogin && username) {
                    navigation.navigate('RiderPage', {
                        username: username,
                        token: result.data.token,
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

/*
  const handleFacebookLogin = async () => {
    try {
      // Step 1: Login with Facebook SDK
      const result = await LoginManager.logInWithPermissions(['public_profile']);

      if (result.isCancelled) {
        Alert.alert('Login cancelled');
        return;
      }

      // Step 2: Get Facebook Access Token
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        Alert.alert('Error', 'Failed to get Facebook access token');
        return;
      }

      console.log('Facebook Access Token:', data.accessToken.toString());

      // Step 3: Send Facebook token to your backend
      const response = await loginWithFacebook(data.accessToken.toString());

      if (response.success) {
        // Step 4: Save YOUR JWT token (not Facebook's token)
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('username', response.data.username);

        Alert.alert('Login Successful', 'Welcome!');

        navigation.navigate('RiderPage', {
          username: response.data.username,
          token: response.data.token,
          profilePicture: response.data.profilePictureUrl,
        });
      } else {
        Alert.alert('Error', response.message || 'Facebook login failed');
      }
    } catch (error) {
      console.error('Facebook login error:', error);
      Alert.alert('Error', 'Facebook login failed. Please try again.');
    }
  };
*/
  // Facebook login

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
/*
            handleFacebookLogin={handleFacebookLogin}
*/
            toggleMode={toggleMode}
            navigation={navigation}
        />
    );
};

export default AuthScreen;
