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
        const user = auth.currentUser;
        if (user) {
            const userId = user.uid;

            try {
                const responsavelDoc = await getDoc(doc(db, 'responsaveis', userId));
                if (!responsavelDoc.exists()) {
                    console.log("Documento de responsável não encontrado.");
                    setLoading(false);
                    return;
                }

                const petId = responsavelDoc.data().petID;

                const matchesQuery1 = query(collection(db, 'matches'), where('petID1', '==', petId));
                const matchesQuery2 = query(collection(db, 'matches'), where('petID2', '==', petId));

                const matchesSnapshot1 = await getDocs(matchesQuery1);
                const matchesSnapshot2 = await getDocs(matchesQuery2);

                const matchedPetsData = [];
                const matchedPetPromises = [];

                matchesSnapshot1.forEach((matchDoc) => {
                    const matchData = matchDoc.data();
                    const matchedPetId = matchData.petID2 ? matchData.petID2.id : null;
                    const petRef = doc(db, 'pets', matchedPetId);
                    const matchId = matchDoc.id;
                    const petPromise = getDoc(petRef);
                    matchedPetPromises.push(petPromise);
                    matchedPetsData.push({ matchId });
                });

                matchesSnapshot2.forEach((matchDoc) => {
                    const matchData = matchDoc.data();
                    const matchedPetId = matchData.petID1 ? matchData.petID1.id : null;
                    const petRef = doc(db, 'pets', matchedPetId);
                    const matchId = matchDoc.id;
                    const petPromise = getDoc(petRef);
                    matchedPetPromises.push(petPromise);
                    matchedPetsData.push({ matchId });
                });

                const petSnapshots = await Promise.all(matchedPetPromises);

                petSnapshots.forEach(async (petData, index) => {
                    if (petData.exists()) {
                        const pet = petData.data();
                        if (!pet.bloqueado) {
                            matchedPetsData[index] = { ...matchedPetsData[index], ...pet, id: petData.id };
                        } else {
                            // Pet bloqueado, não incluir no array
                        }
                        setLoading(false);
                    } else {
                        console.log(`Documento do pet com ID ${petSnapshots[index].id} não encontrado.`);
                    }
                });

                // Filtra apenas os pets não bloqueados
                const filteredPetsData = matchedPetsData.filter(pet => !pet.bloqueado);
                setChatsData(filteredPetsData);

                setLoading(false);
            } catch (error) {
                console.log('Erro ao buscar dados dos chats:', error);
                setLoading(false);
            } finally {
                // Defina refreshing como false após a conclusão da chamada fetchData
                setRefreshing(false);
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
        // Define refreshing como true antes de chamar fetchData
        setRefreshing(true);
        fetchData();
    };

    if (!fontsLoaded && !fontError) {
        return null;
    } // Condição caso as fontes não carreguem

    // Função que renderiza cada chat que aparecerá na lista de chats

    const renderChatItem = ({ item }) => {
        if (item.bloqueado === true) {
            return null; // Não renderiza o card se o perfil estiver bloqueado
        }

        // Agora, antes de renderizar o card, verifique se há um item válido
        if (!item.id || !item.perfilImage || !item.nomePet) {
            return null; // Não renderiza o card se faltarem informações essenciais
        }

        return (
            <TouchableOpacity
                style={styles.chatItemContainer}
                onPress={() => {
                    console.log("PetId a ser enviado para Chat:", item.id);
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
                        <Text style={styles.chatItemName}>{ item.nomePet.length > 10 ? item.nomePet.slice(0, 10) + '...' : item.nomePet}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };




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
                    style={styles.flatListaStyle}
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
