import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';
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