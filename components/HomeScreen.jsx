import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
  Linking,
  Modal,
} from 'react-native';

export default function HomeScreen() {
  const [countryData, setCountryData] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState(null);
  const [displayCount, setDisplayCount] = useState(10); // Number of items to display initially
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContinent, setSelectedContinent] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (countryData) {
      filterData();
    }
  }, [searchText, countryData, selectedContinent, selectedRegion]);

  const fetchData = async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const data = await response.json();
      setCountryData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filterData = () => {
    let filtered = countryData;
    if (searchText) {
      filtered = filtered.filter(country =>
        country.name.common.toLowerCase().includes(searchText.toLowerCase()),
      );
    }
    if (selectedContinent) {
      filtered = filtered.filter(
        country => country.region === selectedContinent,
      );
    }
    if (selectedRegion) {
      filtered = filtered.filter(
        country => country.subregion === selectedRegion,
      );
    }
    setFilteredCountries(filtered);
  };

  const handleShowMore = () => {
    setDisplayCount(displayCount + 10);
  };

  const openGoogleMaps = url => {
    Linking.openURL(url);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const applyFilters = () => {
    if (!selectedContinent && !selectedRegion) {
      setFilteredCountries(countryData);
    } else {
      filterData();
    }
    closeModal();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView} horizontal={false}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search countries..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.filterButton} onPress={openModal}>
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeading}>Select Continent</Text>
              <TouchableOpacity
                style={[
                  styles.filterItem,
                  {
                    backgroundColor:
                      selectedContinent === null ? '#ccc' : '#f0f0f0',
                  },
                ]}
                onPress={() => setSelectedContinent(null)}>
                <Text>No Selection</Text>
              </TouchableOpacity>
              {countryData &&
                [...new Set(countryData.map(country => country.region))].map(
                  (continent, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.filterItem,
                        {
                          backgroundColor:
                            selectedContinent === continent
                              ? '#ccc'
                              : '#f0f0f0',
                        },
                      ]}
                      onPress={() => setSelectedContinent(continent)}>
                      <Text>{continent}</Text>
                    </TouchableOpacity>
                  ),
                )}
              <Text style={styles.modalHeading}>Select Region</Text>
              <TouchableOpacity
                style={[
                  styles.filterItem,
                  {
                    backgroundColor:
                      selectedRegion === null ? '#ccc' : '#f0f0f0',
                  },
                ]}
                onPress={() => setSelectedRegion(null)}>
                <Text>No Selection</Text>
              </TouchableOpacity>
              {countryData &&
                [...new Set(countryData.map(country => country.subregion))].map(
                  (region, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.filterItem,
                        {
                          backgroundColor:
                            selectedRegion === region ? '#ccc' : '#f0f0f0',
                        },
                      ]}
                      onPress={() => setSelectedRegion(region)}>
                      <Text>{region}</Text>
                    </TouchableOpacity>
                  ),
                )}
              <TouchableOpacity
                style={styles.applyButton}
                onPress={applyFilters}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
      <View style={styles.cardContainer}>
        {filteredCountries &&
          filteredCountries.slice(0, displayCount).map((country, index) => (
            <View key={index} style={styles.card}>
              <Image
                source={{uri: country.flags?.png}}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.countryInfo}>
                <Text style={styles.heading}>Common Name:</Text>
                <Text>{country.name.common}</Text>
                <Text style={styles.heading}>Official Name:</Text>
                <Text>{country.name.official}</Text>
                <Text style={styles.heading}>Independence Status:</Text>
                <Text>
                  {country.independent ? 'Independent' : 'Not Independent'}
                </Text>
                <Text style={styles.heading}>Currency:</Text>
                <Text>{country.currencies?.EUR?.name}</Text>
                <Text style={styles.heading}>Currency Symbol:</Text>
                <Text>{country.currencies?.EUR?.symbol}</Text>
                <Text style={styles.heading}>Region:</Text>
                <Text>{country.region}</Text>
                <Text style={styles.heading}>Sub-region:</Text>
                <Text>{country.subregion}</Text>
                <Text style={styles.heading}>Language:</Text>
                <Text>{Object.values(country.languages).join(', ')}</Text>
                <Text style={styles.heading}>Latitude:</Text>
                <Text>{country.latlng[0]}</Text>
                <Text style={styles.heading}>Longitude:</Text>
                <Text>{country.latlng[1]}</Text>
                <Text style={styles.heading}>Area:</Text>
                <Text>{country.area}</Text>
                <TouchableOpacity
                  onPress={() => openGoogleMaps(country.maps?.googleMaps)}
                  style={styles.googleMapsButton}>
                  <Text style={styles.googleMapsText}> Google Map</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </View>
      {filteredCountries && filteredCountries.length > displayCount && (
        <TouchableOpacity
          onPress={handleShowMore}
          style={styles.showMoreButton}>
          <Text style={styles.showMoreText}>Show More</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  filterButton: {
    marginLeft: 10,
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  filterButtonText: {
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalHeading: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filterItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
  },
  applyButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 20,
    width: '100%',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 500,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  countryInfo: {
    padding: 20,
    alignItems: 'center',
  },
  heading: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  googleMapsButton: {
    backgroundColor: '#ccc',
    borderRadius: 5,
    marginTop: 10,
    marginRight: 10,
    alignItems: 'center',
    width: 60,
    flexWrap: 'wrap',
  },
  googleMapsText: {
    fontWeight: 'bold',
    color: 'black',
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  showMoreButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc',
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  showMoreText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
