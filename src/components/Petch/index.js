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

const truncateName = (name) => {
  return name.length > 10 ? `${name.slice(0, 10)}...` : name;
};

const PetchScreen = ({ pet1Name, pet1Image, pet2Name, pet2Image, onClose }) => {
  const truncatedPet1Name = truncateName(pet1Name);
  const truncatedPet2Name = truncateName(pet2Name);
  
  return (
    <View style={styles.container}>
      <View style={styles.matchContainer}>
        <Image source={{ uri: pet1Image }} style={styles.image} />
        <Image source={LogoBranca} style={styles.heartIcon} />
        <Image source={{ uri: pet2Image }} style={styles.image} />
      </View>
      <Text style={styles.matchText}>{truncatedPet1Name} e {truncatedPet2Name} deram PETCH!</Text>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Fechar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PetchScreen;