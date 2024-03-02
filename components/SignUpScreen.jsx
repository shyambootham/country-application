import React, {useState} from 'react';

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const navigation = useNavigation();
  console.log(formData.firstName);
  console.log(formData.lastName);
  console.log(formData.email);
  console.log(formData.mobile);
  console.log(formData.address);
  console.log(formData.password);
  console.log(formData.confirmPassword);
  console.log(formData);
  const handleSubmit = async () => {
    // Validate form data, for example, check if password matches confirmPassword
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    // Reset password error if passwords match
    setPasswordError('');

    // Save form data to AsyncStorage
    try {
      console.log(formData);

      await AsyncStorage.multiSet([
        ['email', formData.email],
        ['password', formData.password],
        ['user', formData.firstName],
        ['lastname', formData.lastName],
        ['mobile', formData.mobile],
        ['address', formData.address],
      ]);

      console.log('Form data saved in AsyncStorage:', formData);
    } catch (error) {
      console.error('Error saving form data:', error);
      // Handle error saving data if needed
    }
    navigation.navigate('SignIn');
    // Navigate to SignIn screen after successful submission
  };
  const handleChange = (key, value) => {
    setFormData({...formData, [key]: value});
  };

  const goToSignIn = () => {
    navigation.navigate('SignIn');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <View style={styles.form}>
          <TextInput
            placeholder="First Name"
            style={styles.input}
            onChangeText={value => handleChange('firstName', value)}
          />
          <TextInput
            placeholder="Last Name"
            style={styles.input}
            onChangeText={value => handleChange('lastName', value)}
          />
          <TextInput
            placeholder="Email"
            style={styles.input}
            onChangeText={value => handleChange('email', value)}
          />
          <TextInput
            placeholder="Mobile"
            style={styles.input}
            onChangeText={value => handleChange('mobile', value)}
          />
          <TextInput
            placeholder="Address"
            style={styles.input}
            onChangeText={value => handleChange('address', value)}
          />
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry={true}
            onChangeText={value => handleChange('password', value)}
          />
          <TextInput
            placeholder="Confirm Password"
            style={styles.input}
            secureTextEntry={true}
            onChangeText={value => handleChange('confirmPassword', value)}
          />
          {/* Display error message if passwords do not match */}
          {passwordError ? (
            <Text style={styles.error}>{passwordError}</Text>
          ) : null}
          <Button
            title="Sign Up"
            onPress={handleSubmit}
            disabled={false} // Replace with actual loading state
          />
        </View>
        <View style={styles.footer}>
          <Text>Already have an account?</Text>
          <TouchableOpacity onPress={goToSignIn}>
            <Text style={styles.signupLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
        {/* Render error message if available */}
        <Text style={styles.error}>{formData.error}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    width: '80%', // Adjust width as needed
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
    marginTop: 5, // Adjust spacing as needed
  },
});
