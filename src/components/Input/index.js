// Importando o React
import React, { useState } from 'react';

// Importando os componentes do React
import { ScrollView, View, Keyboard } from 'react-native';

// Importando os estilos
import { styles } from './style';

// Importando os componentes do react-native-paper
import { TextInput } from 'react-native-paper';

// Componente Input
const Input = ({ label, placeholder, secureTextEntry, value, onChangeText, ...rest }) => {

    const [showPassword, setShowPassword] = useState(false); // Estado que armazena se a senha deve aparecer ou não

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
      Keyboard.dismiss(); // Fecha o teclado ao clicar no ícone
    }

    return (
      <View style={styles.inputContainer}>
        <TextInput
    
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
                onPress={togglePasswordVisibility}
              />
            )
          }
        />
      </View>
    );
  };
  
  export default Input;