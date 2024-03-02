// This component represents the sign-in screen of the application
// It allows users to enter their email and password to sign in

import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default function SignInScreen() {
  // State variables to hold form data and error message
  const [formData, setFormData] = useState({email: '', password: ''});
  const [error, setError] = useState('');
  const navigation = useNavigation();

  // Function to handle sign-in submission
  const handleSubmit = async () => {
    try {
      // Retrieve stored form data from AsyncStorage
      const storedData = await AsyncStorage.multiGet(['email', 'password']);

      // Extract email and password from stored data
      const storedEmail = storedData[0][1];
      const storedPassword = storedData[1][1];

      // Compare entered email and password with stored data
      if (
        formData.email === storedEmail &&
        formData.password === storedPassword
      ) {
        // Credentials match, navigate to home page
        navigation.navigate('Home');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('Error retrieving form data:', error);
      setError('An error occurred. Please try again.');
    }
  };

  // Function to handle input changes
  const handleChange = (key, value) => {
    setFormData({...formData, [key]: value});
  };

  // Function to navigate to sign-up screen
  const goToSignUp = () => {
    navigation.navigate('SignUp'); // Navigate to SignUp screen
  };

  // Render sign-in form
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signin</Text>
      <View style={styles.form}>
        <TextInput
          placeholder="Email"
          style={styles.input}
          onChangeText={value => handleChange('email', value)}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry={true}
          onChangeText={value => handleChange('password', value)}
        />
        <Button
          title="Signin"
          onPress={handleSubmit}
          disabled={false} // Replace with actual loading state
        />
      </View>
      <View style={styles.footer}>
        <Text>Don't Have an account?</Text>
        <TouchableOpacity onPress={goToSignUp}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      {/* Render error message if available */}
      <Text style={styles.error}>{error}</Text>
    </View>
  );
}

// Styles for the sign-in screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signupLink: {
    color: 'blue',
    marginLeft: 5,
  },
  error: {
    color: 'red',
    marginTop: 20,
  },
});
