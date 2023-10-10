import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet  } from 'react-native';
import styles from './styles';

const PetchScreen = ({ pet1Name, pet1Image, pet2Name, pet2Image, onClose }) => {
  return (
    <View style={styles.container}>
      <View style={styles.matchContainer}>
        <Image source={{ uri: pet1Image }} style={styles.image} />
        <Image source={require('../../assets/Icons/coracao.png')} style={styles.heartIcon} />
        <Image source={{ uri: pet2Image }} style={styles.image} />
      </View>
      <Text style={styles.matchText}>{pet1Name} e {pet2Name} deram PETCH!</Text>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Fechar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PetchScreen;