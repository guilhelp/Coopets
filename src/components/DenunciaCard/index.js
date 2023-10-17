// Importando o React
import React, { useState, useEffect } from 'react';

// Importando os componentes do React
import { View, Text, Image, TouchableOpacity } from 'react-native';

// Importando os componentes do react navigation
import { useNavigation } from '@react-navigation/native';

// Importando os ícones
import { MaterialIcons } from '@expo/vector-icons';

// Importando as variáveis do Firebase
import { db } from '../../config/Firebase';

// Importando as funções do Firebase

// Firestore
import { 
  addDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from '@firebase/firestore';

// Importando os estilos
import { styles } from './styles';

// Componente DenunciaCard que exibe informações de denúncia
const DenunciaCard = ({ denuncia, countDenunciasRecebidas, handleExcluirDenunciaExcluirCard }) => {
  const navigation = useNavigation();
  const [countDenunciasRecebidasNum, setCountDenunciasRecebidasNum] = useState(0);
  const [countNotificacoesEnviadas, setCountNotificacoesEnviadas] = useState(0);

  // Função para lidar com a exclusão de uma denúncia
  const handleExcluirDenuncia = () => {
    // Chame a função onExcluirDenuncia passando o ID da denúncia como argumento
    handleExcluirDenunciaExcluirCard(denuncia.id);
  };

  // Função para notificar o usuário sobre a denúncia
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
        alert('Usuário notificado 3 vezes com notificações lidas. Bloqueie o perfil.');
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

  // Função para contar notificações enviadas e lidas para um usuário
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
      // Recupere a contagem de denúncias recebidas
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

export default DenunciaCard;
