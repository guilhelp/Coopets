import React, { useState, useEffect } from 'react';
import { View, ImageBackground, FlatList, TouchableOpacity, Image, Text, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { collection, query, where, getDocs, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db, auth, database } from '../../config/Firebase';
import { child, ref, get } from '@firebase/database';

// Estilos
import styles from './styles';
import Background from '../../assets/Background/Background.png'
import Header from '../../components/Header';

// Importando ícones
import { Ionicons } from '@expo/vector-icons';

// Expo
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_900Black } from '@expo-google-fonts/roboto';

export default function ConsultarPetchs() {
    let [fontsLoaded, fontError] = useFonts({
        LuckiestGuy_400Regular,
        Roboto_900Black,
    });
    const navigation = useNavigation();
    const [chatsData, setChatsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
     // Use um estado separado para armazenar as mensagens
     const [messagesData, setMessagesData] = useState([]);
     
    const fetchData = async () => {
        const user = auth.currentUser;
        if (user) {
            const userId = user.uid;

            try {
                console.log("Iniciando busca de dados...");
                const responsavelDoc = await getDoc(doc(db, 'responsaveis', userId));
                if (!responsavelDoc.exists()) {
                    console.log("Documento de responsável não encontrado.");
                    setLoading(false);
                    return;
                }

                // Buscar os pets que têm match com o pet do responsável logado
                const petId = responsavelDoc.data().petID;
                console.log("ID do Pet do responsável:", petId);

                const matchesQuery1 = query(collection(db, 'matches'), where('petID1', '==', petId));
                const matchesQuery2 = query(collection(db, 'matches'), where('petID2', '==', petId));
                console.log("Executando queries de matches...");

                const matchesSnapshot1 = await getDocs(matchesQuery1);
                const matchesSnapshot2 = await getDocs(matchesQuery2);
                console.log("Obtendo snapshots dos matches...");

                const matchedPetsData = [];

                const matchedPetPromises = [];

                matchesSnapshot1.forEach((matchDoc) => {
                    const matchData = matchDoc.data();
                    const matchedPetId = matchData.petID2 ? matchData.petID2.id : null;
                    const petRef = doc(db, 'pets', matchedPetId);
                    const matchId = matchDoc.id; // Adicione o ID do documento de match
                    const petPromise = getDoc(petRef);
                    matchedPetPromises.push(petPromise);
                    matchedPetsData.push({ matchId, lastMessage: {} }); // Inicialize lastMessage como um objeto vazio
                });
                
                matchesSnapshot2.forEach((matchDoc) => {
                    const matchData = matchDoc.data();
                    const matchedPetId = matchData.petID1 ? matchData.petID1.id : null;
                    const petRef = doc(db, 'pets', matchedPetId);
                    const matchId = matchDoc.id; // Adicione o ID do documento de match
                    const petPromise = getDoc(petRef);
                    matchedPetPromises.push(petPromise);
                    matchedPetsData.push({ matchId, lastMessage: {} }); // Inicialize lastMessage como um objeto vazio
                });

                const petSnapshots = await Promise.all(matchedPetPromises);

                petSnapshots.forEach(async (petData, index) => { // Use async aqui
                    if (petData.exists()) {
                        matchedPetsData[index] = { ...matchedPetsData[index], ...petData.data(), id: petData.id };
                        const lastMessage = await fetchLastMessage(getRoomId(userId, petData.data().responsavelID.id));
                        matchedPetsData[index].lastMessage = lastMessage;
                        setLoading(false); // Adicione isso aqui para indicar que a busca de dados foi concluída
                    } else {
                        console.log(`Documento do pet com ID ${petSnapshots[index].id} não encontrado.`);
                    }
                });

                // Agora a variável matchedPetsData contém todos os pets que deram match com o pet do responsável logado, com a informação de qual pet é o match (petID1 ou petID2).
                setChatsData(matchedPetsData);
                setLoading(false);
            } catch (error) {
                console.log('Erro ao buscar dados dos chats:', error);
                setLoading(false);
            }
        }
    };


    const updateChatsWithLastMessage = () => {
        // Atualize o estado de chatsData com a última mensagem
        const updatedChatsData = chatsData.map((chat) => {
            const matchingMessage = messagesData.find((message) => message.matchId === chat.matchId);
            if (matchingMessage) {
                return { ...chat, lastMessage: matchingMessage.lastMessage };
            }
            return chat;
        });
        setChatsData(updatedChatsData);
    };

    useEffect(() => {
        fetchData(); // Call the async function immediately
      }, []); 

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
        setRefreshing(false);
    };

    function getRoomId(petId1, petId2) {
        console.log('getRoomId - o petid1:', petId1)
        console.log('getRoomId - o petid2:', petId2)
        return [petId1, petId2].sort().join("-");
    }

    async function fetchLastMessage(room) {
        console.log('fetchLastMessage - room:', room);
    
        try {
            // Crie uma referência para o caminho das mensagens no Realtime Database
            const chatRef = ref(database, `messages/${room}`);
            console.log('chatRef:', chatRef.toString());
    
            // Obtenha os dados da referência
            const chatSnapshot = await get(chatRef);
            console.log('chatSnapshot.exists():', chatSnapshot.exists());
    
            if (chatSnapshot.exists()) {
                const chatData = chatSnapshot.val();
                console.log('chatData:', chatData);
    
                if (chatData) {
                    const messages = Object.values(chatData); // Converta o objeto em um array
                    console.log('messages:', messages);
    
                    if (messages.length > 0) {
                        const lastMessage = messages[messages.length - 1];
                        console.log('lastMessage:', lastMessage);
                        return lastMessage;
                    }
                }
            }
    
            return null; // Retorna null se não houver mensagens ou se o caminho não existir
        } catch (error) {
            console.log('Erro ao buscar dados dos chats:', error);
            return null;
        }
    }
    

    if (!fontsLoaded && !fontError) {
        return null;
    }

    const renderChatItem = ({ item }) => (
        <TouchableOpacity
            style={styles.chatItemContainer}
            onPress={() => {
                console.log("PetId a ser enviado para Chat:", item.id); // Adicione este log
                navigation.navigate('Chat', {
                    petId: item.id,
                    petImage: item.perfilImage,
                    petNome: item.nomePet,
                    petResp: item.responsavelID.id,
                    petBio: item.bio,
                    petSexo: item.sexo,
                    petIdade: item.dataNascimentoPet,
                    petPedigree: item.pedigree,
                    petVac: item.vacina,
                    matchId: item.matchId,
                    petTipo: item.tipo,
                    petRaca: item.raca,
                    petCep: item.cep
                });
            }}
        >
            <View style={styles.chatItemContent}>
                <Image source={{ uri: item.perfilImage }} style={styles.chatItemImage} />
                <View style={styles.chatDetailsContent}>
                    <Text style={styles.chatItemName}>{item.nomePet}</Text>
                    {item.lastMessage && (
                        <Text style={styles.chatLastMessage}>
                            {item.lastMessage.message}
                        </Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <ImageBackground source={Background} style={styles.background}>
            <View style={styles.cabecalhoPagina}>
                <Ionicons name={'chatbubbles-sharp'} size={65} color="white" style={styles.chatImage} />
                <Text style={styles.tituloCabecalho}>CHATS</Text>
            </View>
            <View style={styles.container}>
                <FlatList
                    data={chatsData}
                    keyExtractor={(item) => item.matchId}
                    renderItem={renderChatItem}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                />
            </View>
        </ImageBackground>
    );
}
