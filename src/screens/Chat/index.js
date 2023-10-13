import React, { useState, useEffect } from 'react';
import { View, ImageBackground, TouchableOpacity, Image, Text, TextInput, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { ref, set, child, get, onValue } from "firebase/database"
import { database, auth, db } from '../../config/Firebase';
import { doc, getDoc, deleteDoc, query, collection, getDocs, where } from '@firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import Background from '../../assets/Background/Background.png'

import { SimpleLineIcons } from '@expo/vector-icons';
import ChatOptionsMenu from '../../components/ChatOptions';
import { Ionicons } from '@expo/vector-icons';

// Expo
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_900Black } from '@expo-google-fonts/roboto';
import * as Notifications from 'expo-notifications';



const databaseReference = ref(database)


export default function Chat({ route }) {

  let [fontsLoaded, fontError] = useFonts({
    LuckiestGuy_400Regular,
    Roboto_900Black,
  });

  const [isOptionsVisible, setOptionsVisible] = useState(false);
  const navigation = useNavigation();
  const { petId } = route.params
  const { petImage } = route.params
  const { petNome } = route.params
  const { petResp } = route.params
  const { petBio } = route.params
  const { petEndereco } = route.params
  const { petSexo } = route.params
  const { petIdade } = route.params
  const { petPedigree } = route.params
  const { petVac } = route.params
  const { matchId } = route.params
  const { petTipo } = route.params
  const { petRaca } = route.params
  const { petCep } = route.params

  const myId = auth.currentUser.uid

  const [displayMessages, setDisplayMessages] = useState([])
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Solicite permissões para notificações
    const registerForPushNotifications = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          alert('Você não permitiu notificações, algumas funcionalidades podem não funcionar corretamente.');
          return;
        }
      }
    };

    registerForPushNotifications();

    // Subscreva-se para ouvir novas mensagens
    const room = getRoomId();
    const chatReference = ref(database, `messages/${room}`);
    onValue(chatReference, (snapshot) => {
      const newMessages = snapshot.val();
      if (newMessages) {
        setDisplayMessages(newMessages);

        // Envie uma notificação quando uma nova mensagem for recebida
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.userId !== myId) {
          sendNotification(lastMessage.message); // Implemente esta função
        }
      }
    });
  }, []);

  const sendNotification = async (message) => {
    const notificationContent = {
      title: 'Nova mensagem',
      body: message,
    };

    await Notifications.scheduleNotificationAsync({
      content: notificationContent,
      trigger: null, // Notificação imediata
    });
  };

  async function sendNotificationIfNeeded(message) {
    const room = getRoomId();
    const chatReference = ref(database, `messages/${room}`);
    onValue(chatReference, (snapshot) => {
      const newMessages = snapshot.val();
      if (newMessages) {
        setDisplayMessages(newMessages);

        // Obtenha a última mensagem
        const lastMessage = newMessages[newMessages.length - 1];

        // Verifique se a última mensagem foi enviada pela outra pessoa
        if (lastMessage.userId !== myId) {
          // Envie a notificação apenas quando a outra pessoa enviar uma mensagem
          sendNotification(message);
        }
      }
    });
  }

  function getRoomId() {
    return [petResp, myId].sort().join("-")
  }

  async function fetchChatMessages() {
    const room = getRoomId()
    const chatChild = child(databaseReference, `messages/${room}`)
    const chatSnapshot = await get(chatChild)

    if (chatSnapshot.exists()) return chatSnapshot.val()
    else return []
  }

  async function writeMessage() {
    const room = getRoomId()

    try {
      const messages = await fetchChatMessages()
      const chatReference = ref(database, `messages/${room}`)

      set(chatReference, [...messages, { userId: petResp, message }])

      setMessage("")

      console.log("Message has been sent successfully! ✨")
      console.log(`${petResp}: ${message}`)
      // Envie a notificação apenas se a mensagem for enviada pela outra pessoa
      if (petResp !== myId) {
        sendNotificationIfNeeded(message);
      }
    } catch (error) {
      console.error("Something gone wrong with the chat thing!")
      console.error(error)
    }
  }

  async function buttonPress() {
    if (message.trim() !== "") { // Verifique se a mensagem não está em branco (após remover espaços em branco)
      writeMessage("Hello World");
    } else {
      // Exiba um alerta ao usuário informando que a mensagem está em branco
      Alert.alert("Aviso", "Por favor, digite uma mensagem antes de enviar.");
    }
  }


  useEffect(() => {

    async function _() {
      setDisplayMessages(await fetchChatMessages())
    }

    _()

    const room = getRoomId()
    const chatReference = ref(database, `messages/${room}`)
    onValue(chatReference, (snapshot) => {
      setDisplayMessages(snapshot.val())
    })
  }, []);

  const toggleOptionsModal = () => {
    setOptionsVisible(!isOptionsVisible);
  };

  async function fetchPetIdForMyId(myId) {
    try {
      // Crie uma referência ao documento do responsável com base no myId
      const responsavelDocRef = doc(db, 'responsaveis', myId);

      // Obtenha o documento do responsável
      const responsavelDocSnapshot = await getDoc(responsavelDocRef);

      if (responsavelDocSnapshot.exists()) {
        // Se o documento do responsável existe, obtenha a referência do campo "petID"
        const responsavelData = responsavelDocSnapshot.data();
        const petIdReference = responsavelData.petID;

        // Obtenha o ID do pet a partir da referência
        const petId = petIdReference.id;

        if (petId) {
          // Se o ID do pet estiver definido, retorne-o
          return petId;
        } else {
          // Se o ID do pet não estiver definido, retorne null ou um valor padrão, dependendo do seu caso de uso
          return null;
        }
      } else {
        // Se o documento do responsável não existir, retorne null ou um valor padrão, dependendo do seu caso de uso
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar o ID do pet para o myId:', error);
      // Trate o erro conforme necessário
      throw error;
    }
  }

  async function desfazerMatch() {
    try {
      const myPetId = await fetchPetIdForMyId(myId);

      // Use o matchId passado como parâmetro para localizar o documento do match
      const matchDocRef = doc(db, 'matches', matchId);

      // Exclua o documento de match correspondente no Firestore
      await deleteDoc(matchDocRef);

      // Logs para depuração
      console.log(`Documento de match com ID ${matchId} excluído com sucesso.`);

      const myPetIdRef = doc(db, 'pets', myPetId); // Substitua 'pets' pelo nome da coleção onde os documentos de pets estão armazenados
      const petIdRef = doc(db, 'pets', petId); // Substitua 'pets' pelo nome da coleção onde os documentos de pets estão armazenados

      // Exclua os registros de likes onde o pet logado deu like ao pet do match e vice-versa
      const likesQuery1 = query(collection(db, 'likes'),
        where('petIDLike', '==', myPetIdRef),
        where('petIDRecebeu', '==', petIdRef)
      );

      const likesQuery2 = query(collection(db, 'likes'),
        where('petIDLike', '==', petIdRef),
        where('petIDRecebeu', '==', myPetIdRef)
      );

      const likesSnapshot1 = await getDocs(likesQuery1);
      const likesSnapshot2 = await getDocs(likesQuery2);

      // Logs para depuração
      console.log(`Encontrados ${likesSnapshot1.size + likesSnapshot2.size} registros de likes para exclusão.`);

      const allLikesSnapshots = [...likesSnapshot1.docs, ...likesSnapshot2.docs];

      await Promise.all(
        allLikesSnapshots.map(async (likeDoc) => {
          const likeDocRef = doc(db, 'likes', likeDoc.id);
          await deleteDoc(likeDocRef);

          // Logs para depuração
          console.log(`Registro de like com ID ${likeDoc.id} excluído com sucesso.`);
        })
      );

      const avaliacoesQuery1 = query(collection(db, 'avaliacoes'),
        where('userId', '==', myId),
        where('petIdAvaliado', '==', petIdRef)
      );

      const avaliacoesSnapshot1 = await getDocs(avaliacoesQuery1);

      // Logs para depuração
      console.log(`Encontrados ${avaliacoesSnapshot1.size} registros de avaliações do pet logado para exclusão.`);

      await Promise.all(
        avaliacoesSnapshot1.docs.map(async (avaliacaoDoc) => {
          const avaliacaoDocRef = doc(db, 'avaliacoes', avaliacaoDoc.id);
          await deleteDoc(avaliacaoDocRef);

          // Logs para depuração
          console.log(`Registro de avaliação com ID ${avaliacaoDoc.id} excluído com sucesso.`);
        })
      );

      // Avaliações do outro pet
      const responsavelQuery = query(collection(db, 'responsaveis'), where('petID', '==', petIdRef));
      const responsavelSnapshot = await getDocs(responsavelQuery);

      // Verifique se há um responsável com esse petID
      if (!responsavelSnapshot.empty) {
        let responsavelDoc; // Defina a variável responsavelDoc fora do loop

        responsavelSnapshot.forEach((responsavelDocSnapshot) => {
          const responsavelData = responsavelDocSnapshot.data();
          const responsavelUserId = responsavelData.userId;

          console.log('O responsável é:', responsavelUserId);
          console.log('Código do documento do responsável:', responsavelDocSnapshot.id);

          // Atribua o valor de responsavelDocSnapshot a responsavelDoc
          responsavelDoc = responsavelDocSnapshot;
        });

        // Agora você pode usar a variável responsavelDoc fora do loop

        // Exclua as avaliações do pet logado feitas pelo responsável
        const avaliacoesQuery2 = query(collection(db, 'avaliacoes'),
          where('userId', '==', responsavelDoc.id),
          where('petIdAvaliado', '==', myPetIdRef)
        );

        const avaliacoesSnapshot2 = await getDocs(avaliacoesQuery2);

        // Logs para depuração
        console.log(`Encontrados ${avaliacoesSnapshot2.size} registros de avaliações do pet logado feitas pelo responsável para exclusão.`);

        await Promise.all(
          avaliacoesSnapshot2.docs.map(async (avaliacaoDoc) => {
            const avaliacaoDocRef = doc(db, 'avaliacoes', avaliacaoDoc.id);
            await deleteDoc(avaliacaoDocRef);

            // Logs para depuração
            console.log(`Registro de avaliação com ID ${avaliacaoDoc.id} excluído com sucesso.`);
          })
        );
      } else {
        console.log('Nenhum responsável encontrado com o petID igual a', petIdRef);
      }


      // Após remover o match e registros relacionados, você pode fazer outras ações, como navegar de volta.
      navigation.goBack(); // Navegar de volta para a tela anterior, por exemplo.
    } catch (error) {
      console.error("Erro ao desfazer o match:", error);
    }
  }


  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ImageBackground source={Background} style={styles.background}>
        <KeyboardAvoidingView
                    behavior={'padding'}
                    style={styles.container}
                    keyboardVerticalOffset={0}>
                    <ScrollView style={styles.scrollContainer}>
        <View style={styles.cabecalhoPagina}>

          <TouchableOpacity style={styles.petDetails} onPress={() => navigation.navigate('ConsultarPerfil', { petId, petImage, petNome, petBio, petCep, petSexo, petTipo, petRaca, petIdade, petPedigree, petVac })}>
            <Image source={{ uri: petImage }} style={styles.petImage} />
            <Text style={styles.petName}>{petNome}</Text>
          </TouchableOpacity>
          <View style={styles.botoesContainerOption}>
            <TouchableOpacity onPress={toggleOptionsModal} style={styles.optionButton}>
              <SimpleLineIcons name={'options-vertical'} size={35} color="white" style={styles.optionIcon} />
            </TouchableOpacity>
          </View>
        </View>

        
        <View style={styles.fundoBranco}>
        
          <View style={styles.botoesContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('BottomTabs')} style={styles.returnButton}>
              <Ionicons name={'arrow-undo'} size={40} color="white" style={styles.returnIcon} />
            </TouchableOpacity>

            {/* Renderize o modal de opções */}
            <ChatOptionsMenu
              isVisible={isOptionsVisible}
              onDesfazerMatchPress={() => {
                desfazerMatch();
                toggleOptionsModal(); // Feche o modal após desfazer o match
              }}
              onClose={toggleOptionsModal}
            />
          </View>

          
      
            {displayMessages ? (
              displayMessages.map((msg, id) => (
                <View
                  key={id}
                  style={[
                    styles.messageContainer,
                    msg.userId === petResp ? styles.myMessage : styles.otherMessage
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      msg.userId === myId ? styles.myMessageText : styles.otherMessageText
                    ]}
                  >
                    {msg.message}
                  </Text>
                </View>
              ))
            ) : (
              <Text>No messages available.</Text>
            )}
      
          
          <View style={styles.inputContainer}>
         
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={(value) => setMessage(value)} placeholder="Digite uma mensagem"
            />
            <TouchableOpacity style={styles.sendButton} onPress={buttonPress}>
              <Icon name="send" size={30} color="gray" />
            </TouchableOpacity>
          
          </View>
        </View>
        </ScrollView>
        </KeyboardAvoidingView>
       
    </ImageBackground>
  );
}
