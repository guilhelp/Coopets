// Importando o React
import React, { useState, useEffect } from 'react';

// Importando os componentes do React
import { 
    View, 
    ImageBackground, 
    FlatList, 
    TouchableOpacity, 
    Image, 
    Text, 
    RefreshControl 
} from 'react-native';

// Importando as variáveis do Firebase
import { db, auth } from '../../config/Firebase';

// Importando as funções do Firebase

// Firestore
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    doc, 
    getDoc, 
    onSnapshot 
} from 'firebase/firestore';

// Importando os componentes do react navigation
import { useNavigation } from '@react-navigation/native';

// Importando os estilos
import styles from './styles';

// Importando imagens
import Background from '../../assets/Background/Background.png'

// Importando os ícones
import { Ionicons } from '@expo/vector-icons';

// Importnado fontes
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_900Black } from '@expo-google-fonts/roboto';

export default function ConsultarPetchs() {

    let [fontsLoaded, fontError] = useFonts({
        LuckiestGuy_400Regular,
        Roboto_900Black,
    }); // Estado que armazena as fontes do projeto

    const navigation = useNavigation(); // Variável de navegação

    
    const [chatsData, setChatsData] = useState([]); // Estado que armazena os dados dos chats
    const [loading, setLoading] = useState(true); // Estado que verifica se a tela esta carregando ou não
    const [refreshing, setRefreshing] = useState(false); // Estado para atualizar a lista de chats

    // Função para buscar os chats
    const fetchData = async () => {
        const user = auth.currentUser; // Armazena o usuário logado
        if (user) {
            const userId = user.uid;

            try {

                // Busca o responsável logado
                const responsavelDoc = await getDoc(doc(db, 'responsaveis', userId));
                if (!responsavelDoc.exists()) {
                    console.log("Documento de responsável não encontrado.");
                    setLoading(false);
                    return;
                }

                // Busca o pet que pertence ao responsável logado
                const petId = responsavelDoc.data().petID;
               

                // Busca os matches que existem entre algum pet e o pet logado na coleção de matches
                const matchesQuery1 = query(collection(db, 'matches'), where('petID1', '==', petId));
                const matchesQuery2 = query(collection(db, 'matches'), where('petID2', '==', petId));
                
                // Pega os documentos buscados
                const matchesSnapshot1 = await getDocs(matchesQuery1);
                const matchesSnapshot2 = await getDocs(matchesQuery2);
                

                const matchedPetsData = []; // Variável para armazenar os dados do match
                const matchedPetPromises = []; // Variável para armazenar os dados do match

                // Função para buscar os documentos de match
                matchesSnapshot1.forEach((matchDoc) => {
                    const matchData = matchDoc.data();
                    const matchedPetId = matchData.petID2 ? matchData.petID2.id : null;
                    const petRef = doc(db, 'pets', matchedPetId);
                    const matchId = matchDoc.id;
                    const petPromise = getDoc(petRef);
                    matchedPetPromises.push(petPromise);
                    matchedPetsData.push({ matchId }); 
                });
                
                // Função para buscar os documentos de match
                matchesSnapshot2.forEach((matchDoc) => {
                    const matchData = matchDoc.data();
                    const matchedPetId = matchData.petID1 ? matchData.petID1.id : null;
                    const petRef = doc(db, 'pets', matchedPetId);
                    const matchId = matchDoc.id;
                    const petPromise = getDoc(petRef);
                    matchedPetPromises.push(petPromise);
                    matchedPetsData.push({ matchId }); 
                });

                
                // Variável que armazena as informações do pet que possui match com o pet logado
                const petSnapshots = await Promise.all(matchedPetPromises); 

                // Busca as informações referente ao pet que possui match com o pet logado
                petSnapshots.forEach(async (petData, index) => { 
                    if (petData.exists()) {
                        matchedPetsData[index] = { ...matchedPetsData[index], ...petData.data(), id: petData.id };
                        setLoading(false);
                    } else {
                        console.log(`Documento do pet com ID ${petSnapshots[index].id} não encontrado.`);
                    }
                });

                // Variável que contém todos os pets que deram match com o pet logado, com a informação de qual pet é o match (petID1 ou petID2).
                setChatsData(matchedPetsData);
                setLoading(false); // Seta o carregamento como falso
            } catch (error) {
                console.log('Erro ao buscar dados dos chats:', error);
                setLoading(false);
            }
        }
    };

    // Lógica para atualizar a lista toda vez que houver um novo match
    useEffect(() => {
        fetchData();
        const user = auth.currentUser; // Variável que armazena o usuário logado
        if (user) {
            const userId = user.uid;
    
            const getPetID = async () => {
                try {
                    // Busca o documento do responsável logado
                    const responsavelDoc = await getDoc(doc(db, 'responsaveis', userId));
                    if (!responsavelDoc.exists()) {
                        console.log("Documento de responsável não encontrado.");
                        setLoading(false);
                        return;
                    }
    
                    if (responsavelDoc.exists()) {
                        // Busca o pet que pertence ao responsável logado
                        const petId = responsavelDoc.data().petID;

                        // Busca todos os documentos de match que o pet logado pertence
                        const matchesQuery = query(collection(db, 'matches'), where('petID1', 'in', [petId, 'petID2']));
        
                        // Verifica se há algum novo documento de match
                        const unsubscribe = onSnapshot(matchesQuery, (snapshot) => {
                            snapshot.docChanges().forEach((change) => {
                                if (change.type === 'added') {
                                    // Caso tenha um novo match foi criado envolvendo o pet logado
                                    // Atualiza os chats quando um novo match for adicionado
                                    fetchData();
                                } else if (change.type === 'removed') {
                                    // Caso um match foi removido envolvendo o pet logado
                                    // Atualiza os chats quando um match for removido
                                    fetchData();
                                }
                            });
                        });
    
                        // Cancela a inscrição para evitar vazamentos de memória
                        return () => {
                            unsubscribe();
                        };
                    }
                } catch (error) {
                    console.error("Erro na consulta Firestore:", error);
                }
            }
    
            getPetID();
        }
    }, []);
    
    // Função para atualizar a lista
    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
        setRefreshing(false);
    };

    if (!fontsLoaded && !fontError) {
        return null;
    } // Condição caso as fontes não carreguem

    // Função que renderiza cada chat que aparecerá na lista de chats
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
