import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default function Nav() {
  const navigation = useNavigation();
  const goToHome = () => {
    navigation.navigate('Home');
  };
  const goToSignIn = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={goToSignIn}>
        <Text style={styles.menuText} onPress={goToHome}>
          Home
        </Text>
      </TouchableOpacity>
      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={goToSignIn}>
          <Text style={styles.menuText}>Sign In</Text>
        </TouchableOpacity>

        {/* Add other menu items here */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#D3E2E2',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F5',
    borderRadius: 25,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: '#3E4E59',
  },
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#3E4E59',
  },
});
