// Importando o React
import React, { useState, useEffect } from 'react';

// Importando os componentes do React
import { Image, View, TouchableOpacity } from 'react-native';

// Importando os componentes do react navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importando as telas
import Login from './screens/Login';
import CadastrarResponsavel from './screens/Cadastrar/Responsavel';
import CadastrarPet from './screens/Cadastrar/Pet';
import CadastrarPet2 from './screens/Cadastrar/Pet2';
import CadastrarPet3 from './screens/Cadastrar/Pet3';
import Avaliacao from './screens/Avaliacao';
import Filtros from './screens/Filtros';
import ConsultarPetchs from './screens/ConsultarPetchs';
import Perfil from './screens/Perfil';
import Chat from './screens/Chat';
import EsqueceuSenha from './screens/EsqueceuSenha';
import ConsultarPerfil from './screens/ConsultarPerfil';
import ConsultarDocumentos from './screens/ConsultarDocumentos';
import Documentos from './screens/Documentos';
import EditarPerfil from './screens/EditarPerfil';
import ValidarDenuncias from './screens/ValidarDenuncias';
import ConsultarPerfilAdm from './screens/ConsultarPerfilAdm';

const Stack = createNativeStackNavigator(); // Variável do stack do react navigation
const Tab = createBottomTabNavigator(); // Variável do tab do react navigation

// Componente personalizado para a barra de guias inferior
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const [activeRoute, setActiveRoute] = useState(state.routes[state.index].name);

  useEffect(() => {
    // Atualiza a rota ativa quando a navegação é alterada
    setActiveRoute(state.routes[state.index].name);
  }, [state]);

  const backgroundColor = '#573C35';
  const borderColor = '#EEE1D3';
  const iconWidth = 60;
  const iconHeight = 50;

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor,
        borderColor,
        height: 100,
        width: '100%',
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = activeRoute === route.name; // Usa a rota ativa para verificar o foco
        
        // Define as imagens de acordo com a rota e o estado de foco
        let imageSource;
        if (route.name === 'ConsultarPetchs') {
          imageSource = isFocused
            ? require('./assets/Icons/ChatIconSelected.png')
            : require('./assets/Icons/ChatIcon.png');
        } else if (route.name === 'Avaliacao') {
          imageSource = isFocused
            ? require('./assets/Icons/HomeIconSelected.png')
            : require('./assets/Icons/HomeIcon.png');
        } else if (route.name === 'Perfil') {
          imageSource = isFocused
            ? require('./assets/Icons/PerfilIconSelected.png')
            : require('./assets/Icons/PerfilIcon.png');
        }

        return (
          <TouchableOpacity
            key={index}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => navigation.navigate(route.name)}
          >
            <Image source={imageSource} style={{ width: iconWidth, height: iconHeight }} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// Componente para a barra de guias inferior
function BottomTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'transparent', // Define o background como transparente
            height: 100,
            zIndex: 1,
          }}
        >
          <CustomTabBar {...props} />
        </View>
      )}
    >
      <Tab.Screen name="Avaliacao" component={Avaliacao} options={{ headerShown: false }} />
      <Tab.Screen name="ConsultarPetchs" component={ConsultarPetchs} options={{ headerShown: false }} />
      <Tab.Screen name="Perfil" component={Perfil} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

// Componente para as rotas de navegação
function Rotas() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CadastrarResponsavel" component={CadastrarResponsavel} />
        <Stack.Screen name="CadastrarPet1" component={CadastrarPet} />
        <Stack.Screen name="CadastrarPet2" component={CadastrarPet2} />
        <Stack.Screen name="CadastrarPet3" component={CadastrarPet3} />
        <Stack.Screen name="Avaliacao" component={Avaliacao} />
        <Stack.Screen name="Filtros" component={Filtros} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ConsultarPetchs" component={ConsultarPetchs} />
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="BottomTabs" component={BottomTabs} screenOptions={{ headerShown: false }} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="EsqueceuSenha" component={EsqueceuSenha} />
        <Stack.Screen name="ConsultarPerfil" component={ConsultarPerfil} />
        <Stack.Screen name="ConsultarDocumentos" component={ConsultarDocumentos} />
        <Stack.Screen name="Documentos" component={Documentos} />
        <Stack.Screen name="EditarPerfil" component={EditarPerfil} />
        <Stack.Screen name="ValidarDenuncias" component={ValidarDenuncias} />
        <Stack.Screen name="ConsultarPerfilAdm" component={ConsultarPerfilAdm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Rotas;
