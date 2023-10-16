// Importando o React
import React from 'react';

// Importando os componentes do React
import { View, Text } from 'react-native';

// Importando os estilos
import { styles } from './styles';

// Importando os ícones
import { MaterialIcons } from '@expo/vector-icons';

// Componente Cabecalho
const Header = ({ title, iconName }) => {
    return (
      <View style={styles.header}>
        <MaterialIcons name={iconName} size={65} color="white" style={styles.button}/>
        <Text style={styles.headerText}>{title}</Text>
      </View>
    );
  };
  
export default Header;