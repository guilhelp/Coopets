import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

const DenunciaCard = ({ denuncia }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Image
          source={{ uri: denuncia.fotoPerfil }}
          style={styles.imagemPerfil}
        />
        <Text style={styles.nomePerfil}>{denuncia.nomePerfil}</Text>
        <TouchableOpacity
          onPress={() => handleExcluirDenuncia(denuncia.id)}
          style={styles.buttonLixeira}
        >
          <MaterialIcons name="delete" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <Text style={styles.motivo}>Motivo: {denuncia.motivo}</Text>
      <View style={styles.containerBotoes}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Notificar', { denuncia })}
        >
          <Text style={styles.buttonText}>Notificar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('ConsultarPerfilAdm', {
                petImage: denuncia.fotoPerfil,
                petNome: denuncia.nomePerfil,
                petBio: denuncia.petBio,
                petSexo: denuncia.petSexo,
                petIdade: denuncia.petIdade,
                petPedigree: denuncia.petPedigree,
                petVac: denuncia.petVac,
                petResp: denuncia.petResp,
                petTipo: denuncia.petTipo,
                petRaca: denuncia.petRaca,
                petCep: denuncia.petCep,
                petId: denuncia.petId      
              });
        }}>
          <Text style={styles.buttonText}>Perfil</Text>
        </TouchableOpacity>
        
      </View>
      <Text style={styles.idText}>Id: {denuncia.idDenuncia}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#573C35',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#8E8E8E',
    borderWidth: 5,
    borderColor: '#FFF',
    borderRadius: 20,
    margin: 30,
    marginTop: 10,
    width: 330,
    height: 240,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  imagemPerfil: {
    width: 60,
    height: 60,
    borderRadius: 1000,
    marginLeft: 10,
    
  },
  nomePerfil: {
    marginLeft: 10,
    color: 'white',
    fontSize: wp('5%'),
    fontWeight: 'bold'
  },
  motivo: {
    marginLeft: 10,
    color: 'white',
    fontSize: wp('4%'),
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  containerBotoes: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    alignItems: 'center',
    
  },
  button: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 5,
    width: 107,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  buttonText: {
    color: '#000000',
    fontFamily: 'Roboto_900Black',
    fontSize: wp('4%'),
  },
  buttonLixeira: {
    padding: 8,
    borderRadius: 5,
    marginLeft: 250,
    position: 'absolute'
  },
  idText:{
    marginTop: 10,
    color: '#FFF',
    fontFamily: 'Roboto_900Black',
    fontSize: wp('3%'),
    marginLeft: 5,
  },
});

export default DenunciaCard;
