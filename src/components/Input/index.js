import React, { useState } from 'react';
import { View } from 'react-native';
import { styles } from './style';
import { TextInput } from 'react-native-paper';

// Componente Input
const Input = ({ label, placeholder, secureTextEntry, value, onChangeText, ...rest }) => {

    const [showPassword, setShowPassword] = useState(false);

    return (
      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          label={label}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry && !showPassword}
          value={value}
          onChangeText={onChangeText}
          {... rest}
          style={styles.input}
          right={
            secureTextEntry && ( // Adicione o ícone apenas se for uma entrada de senha
              <TextInput.Icon
                icon={showPassword ? 'eye' : 'eye-off'}
                size={30}
                color="black"
                style={styles.iconButton}
                onPress={() => setShowPassword(!showPassword)}
              />
            )
          }
        />
      </View>
    );
  };
  
  export default Input;