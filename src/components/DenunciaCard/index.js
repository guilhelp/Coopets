import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import { db } from '../../config/Firebase';
import { addDoc, collection, query, where, getDocs } from '@firebase/firestore';


const DenunciaCard = ({ denuncia, countDenunciasRecebidas, handleExcluirDenunciaExcluirCard }) => {
  const navigation = useNavigation();
  const [countDenunciasRecebidasNum, setCountDenunciasRecebidasNum] = useState(0);
  const [countNotificacoesEnviadas, setCountNotificacoesEnviadas] = useState(0);

  const handleExcluirDenuncia = () => {
    // Chame a função onExcluirDenuncia passando o ID da denúncia como argumento
    handleExcluirDenunciaExcluirCard(denuncia.id);
  };

  const handleNotificarUsuario = async () => {
    try {
      // Verifique a contagem de notificações lidas
      const notificacoesLidasQuery = query(
        collection(db, 'notificacoes'),
        where('userId', '==', denuncia.petResp),
        where('lida', '==', true)
      );
  
      const notificacoesLidasSnapshot = await getDocs(notificacoesLidasQuery);
      const notificacoesLidasCount = notificacoesLidasSnapshot.size;
  
      if (notificacoesLidasCount >= 3) {
        alert('Usuário notificado 3 vezes com notificações lidas. Apague o perfil.');
      } else {
        // Crie um documento de notificação no Firestore
        const notificacaoRef = await addDoc(collection(db, 'notificacoes'), {
          userId: denuncia.petResp, // ID do usuário que recebeu a denúncia
          motivoDenuncia: denuncia.motivo, // Motivo da denúncia
          lida: false, // Define como não lida inicialmente
        });
  
        // Exiba um alerta ao administrador confirmando a notificação
        alert('Notificação enviada para o usuário.');
  
        // Recupere a contagem de notificações enviadas para o usuário
        const notificacoesEnviadasQuery = query(
          collection(db, 'notificacoes'),
          where('userId', '==', denuncia.petResp)
        );
  
        const notificacoesEnviadasSnapshot = await getDocs(notificacoesEnviadasQuery);
        setCountNotificacoesEnviadas(notificacoesEnviadasSnapshot.size);
      }
    } catch (error) {
      console.error('Erro ao notificar o usuário:', error);
    }
  };
  

  const countNotificacoesEnviadasLidas = async (userId) => {
    try {
      const notificacoesLidasQuery = query(
        collection(db, 'notificacoes'),
        where('userId', '==', userId),
        where('lida', '==', true)
      );

      const notificacoesLidasSnapshot = await getDocs(notificacoesLidasQuery);
      return notificacoesLidasSnapshot.size;
    } catch (error) {
      console.error('Erro ao contar notificações enviadas lidas:', error);
      return 0;
    }
  };


  const [countNotificacoesEnviadasLidasNum, setCountNotificacoesEnviadasLidasNum] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const count = await countDenunciasRecebidas(denuncia.petId);
      setCountDenunciasRecebidasNum(count); // Atualize o estado com o valor obtido

      // Recupere a contagem de notificações enviadas para o usuário
      const notificacoesEnviadasQuery = query(
        collection(db, 'notificacoes'),
        where('userId', '==', denuncia.petResp)
      );

      const notificacoesEnviadasSnapshot = await getDocs(notificacoesEnviadasQuery);
      setCountNotificacoesEnviadas(notificacoesEnviadasSnapshot.size);

      // Recupere a contagem de notificações enviadas lidas para o usuário
      const notificacoesEnviadasLidasCount = await countNotificacoesEnviadasLidas(denuncia.petResp);
      setCountNotificacoesEnviadasLidasNum(notificacoesEnviadasLidasCount);
    };

    fetchData();
  }, [denuncia.petId]);

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Image source={{ uri: denuncia.fotoPerfil }} style={styles.imagemPerfil} />
        <Text style={styles.nomePerfil}>{denuncia.nomePerfil}</Text>
        <TouchableOpacity onPress={() => handleExcluirDenuncia(denuncia.id)} style={styles.buttonLixeira}>
          <MaterialIcons name="delete" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <Text style={styles.motivo}>Motivo: {denuncia.motivo}</Text>
      <View style={styles.containerBotoes}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleNotificarUsuario();
          }}
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
              petId: denuncia.petId,
            });
          }}
        >
          <Text style={styles.buttonText}>Perfil</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.idText}>Id: {denuncia.idDenuncia}</Text>
      <Text style={styles.idText}>Denúncias Recebidas: {countDenunciasRecebidasNum}</Text>
      <Text style={styles.idText}>Notificações Enviadas Lidas: {countNotificacoesEnviadasLidasNum}</Text>
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
    height: 280,
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
  idText: {
    marginTop: 10,
    color: '#FFF',
    fontFamily: 'Roboto_900Black',
    fontSize: wp('3%'),
    marginLeft: 5,
  },
});

export default DenunciaCard;
