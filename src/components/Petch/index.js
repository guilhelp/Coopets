// Importando o React
import React from 'react';

// Importando os componentes do React
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity  
} from 'react-native';

// Importando os estilos
import {styles} from './styles';

// Importando imagens
import LogoBranca from '../../assets/Logo/Logo_FundoBranco.png';

const PetchScreen = ({ pet1Name, pet1Image, pet2Name, pet2Image, onClose }) => {
  return (
    <View style={styles.container}>
      <View style={styles.matchContainer}>
        <Image source={{ uri: pet1Image }} style={styles.image} />
        <Image source={LogoBranca} style={styles.heartIcon} />
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