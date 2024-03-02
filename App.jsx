import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  BackHandler,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignInScreen from './components/SignInScreen.jsx';
import SignUpScreen from './components/SignUpScreen.jsx';
import Nav from './components/Nav.jsx';
import HomeScreen from './components/HomeScreen.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App() {
  // Create a stack navigator
  const Stack = createNativeStackNavigator();

  // State to manage loading state
  const [loading, setLoading] = useState(true);

  // State to manage back warning display
  const [showBackWarning, setShowBackWarning] = useState(false);

  // State to hold stored user
  const [storedUser, setStoredUser] = useState(null);

  // useEffect to handle side effects like fetching data
  useEffect(() => {
    // Function to handle back button press
    const backAction = () => {
      setShowBackWarning(true); // Show the warning message
      return true; // Prevent default back button behavior
    };

    // Function to fetch data from AsyncStorage
    const fetchData = async () => {
      try {
        // Fetch stored user data from AsyncStorage
        const storedData = await AsyncStorage.multiGet(['user']);
        const storedUser = storedData[0][1];
        setStoredUser(storedUser); // Set stored user in state
        // Process stored data as needed
      } catch (error) {
        console.error('Error fetching data from AsyncStorage:', error);
      }
    };

    // Call fetchData function
    fetchData();

    // Add event listener for hardware back press
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    // Simulate async operation, like fetching data or loading resources
    setTimeout(() => {
      setLoading(false); // Set loading to false after 5 seconds
    }, 5000);

    // Cleanup function to remove event listener when component unmounts
    return () => backHandler.remove();
  }, []);

  // Function to handle "Yes" button press in back warning modal
  const handleYes = () => {
    BackHandler.exitApp(); // Close the application
  };

  // Function to handle "No" button press in back warning modal
  const handleNo = () => {
    setShowBackWarning(false); // Hide the warning message
  };

  // If loading, display loading indicator
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Country</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Once loading is complete, render the navigation container
  return (
    <NavigationContainer>
      {/* Stack navigator for managing navigation */}
      <Stack.Navigator
        initialRouteName={storedUser ? 'Home' : 'SignIn'} // Set initial route based on stored user
        screenOptions={{
          header: ({navigation}) => <Nav navigation={navigation} />, // Custom header component
        }}>
        {/* Define screen components */}
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>

      {/* Modal for displaying back warning */}
      {showBackWarning && (
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Do you want to close the application?
            </Text>
            <View style={styles.buttonContainer}>
              {/* "Yes" button */}
              <TouchableOpacity onPress={handleYes}>
                <Text style={styles.button}>Yes</Text>
              </TouchableOpacity>
              {/* "No" button */}
              <TouchableOpacity onPress={handleNo}>
                <Text style={styles.button}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    marginHorizontal: 10,
    color: 'blue',
  },
});

export default App;
