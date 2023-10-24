// Importando o React
import React, { useState, useEffect } from 'react';

// Importando os componentes do React
import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    KeyboardAvoidingView,
    FlatList,
    ScrollView
} from 'react-native';

// Importando as variáveis do Firebase
import { db, auth } from '../../config/Firebase';

// Importando as funções do Firebase

// Firestore
import {
    collection,
    query,
    getDocs,
    where,
    doc,
    getDoc,
    deleteDoc
} from 'firebase/firestore';

// Auth
import { signOut } from 'firebase/auth';

// Importando os componentes do react navigation
import { useNavigation } from '@react-navigation/native';

// Importando ícones
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

// Importando os estilos
import { styles } from './styles';

// Importando os componentes do react-native-paper
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

// Importando imagens
import Background from '../../assets/Background/Background.png';

// Importando os componentes
import DenunciaCard from '../../components/DenunciaCard';

// Importando as fontes
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_900Black } from '@expo-google-fonts/roboto';

// Configurando cores do react native paper
const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'black',
    },
};

export default function ValidarDenuncias() {
    let [fontsLoaded, fontError] = useFonts({
        LuckiestGuy_400Regular,
        Roboto_900Black,
    }); // Estado que armazena as fontes do projeto

    const navigation = useNavigation(); // Variável de navegação

    const [denuncias, setDenuncias] = useState([]); // Estado que armazena as denúncias

    // Lógica para buscar as denúncias no banco de dados
    useEffect(() => {
        const loadDenuncias = async () => {
            try {
                // Consulta a coleção 'denuncias' no banco de dados Firestore
                const q = query(collection(db, 'denuncias'));
                const querySnapshot = await getDocs(q);
    
                const denunciasData = [];
                for (const docSnap of querySnapshot.docs) {
                    const denuncia = docSnap.data();
                    const idRecebedor = denuncia.idRecebedor;
    
                    // Log para verificar o ID do recebedor
                    console.log('ID do Recebedor:', idRecebedor);
    
                    // Busque informações do pet (recebedor)
                    const petDocRef = doc(db, 'pets', idRecebedor);
    
                    // Log para verificar a referência do documento do pet
                    console.log('Referência do Documento do Pet:', petDocRef);
    
                    const petDocSnap = await getDoc(petDocRef);
                    if (petDocSnap.exists()) {
                        const petData = petDocSnap.data();
    
                        // Log para verificar os dados do pet
                        console.log('Dados do Pet:', petData);
                        console.log('foto', petData.perfilImage)
                        denunciasData.push({
                            id: docSnap.id,
                            motivo: denuncia.motivo,
                            dataDenuncia: denuncia.data.toDate(),
                            fotoPerfil: petData.perfilImage,
                            nomePerfil: petData.nomePet,
                            petBio: petData.bio,
                            petId: idRecebedor,
                            petResp: petData.responsavelID.id,
                            petSexo: petData.sexo,
                            petIdade: petData.dataNascimentoPet,
                            petPedigree: petData.pedigree,
                            petVac: petData.vacina,
                            petTipo: petData.tipo,
                            petRaca: petData.raca,
                            petCep: petData.cep,
                            idDenuncia: denuncia.id
                        });
                    }
                }
    
                // Log para verificar as denúncias carregadas
                console.log('Denúncias Carregadas:', denunciasData);
    
                setDenuncias(denunciasData);
            } catch (error) {
                console.error('Erro ao carregar denúncias:', error);
            }
        };
    
        loadDenuncias();
    }, []);
    
    // Função para contar o número de denúncias recebidas por um perfil
    const countDenunciasRecebidas = async (petId) => {
        try {
            const q = query(collection(db, 'denuncias'), where('idRecebedor', '==', petId));
            const querySnapshot = await getDocs(q);
            return querySnapshot.size; // Retorna o número de documentos que correspondem à consulta
        } catch (error) {
            console.error('Erro ao contar denúncias recebidas:', error);
            return 0; // Em caso de erro, retorna 0
        }
    };
    
    // Função para excluir uma denúncia com base no ID da denúncia
    const handleExcluirDenunciaExcluir = async (denunciaId) => {
        try {
            // Referência para o documento da denúncia
            const denunciaRef = doc(db, 'denuncias', denunciaId);
    
            // Exclua o documento da denúncia
            await deleteDoc(denunciaRef);
    
            // Atualize a lista de denúncias localmente (remova a denúncia excluída)
            setDenuncias((prevDenuncias) =>
                prevDenuncias.filter((denuncia) => denuncia.id !== denunciaId)
            );
    
            console.log('Denúncia excluída com sucesso.');
        } catch (error) {
            console.error('Erro ao excluir a denúncia:', error);
        }
    };
    
    // Função para fazer logout
    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.navigate('Login'); // Navega para a tela de login após o logout
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };
    
    if (!fontsLoaded && !fontError) {
        return null;
    } // Condição caso as fontes não carreguem

    return (
        <PaperProvider theme={theme}>
            <ImageBackground source={Background} style={styles.background}>
                <View style={styles.cabecalhoPagina}>
                    <MaterialIcons name={'admin-panel-settings'} size={65} color="white" style={styles.logoAdm} />
                    <Text style={styles.tituloCabecalho}>ADMIN</Text>
                    <TouchableOpacity onPress={handleLogout}>
                        <MaterialCommunityIcons name={'logout'} size={60} color="white" style={styles.sairButton} />
                    </TouchableOpacity>
                </View>
                <View style={styles.container}>
                    <Text style={styles.tituloDenuncias}>DENÚNCIAS</Text>
             
                    <View style={styles.denunciasCard}>
                        <FlatList
                            style={styles.flatlistStyle}
                            data={denuncias}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <DenunciaCard
                                    denuncia={item}
                                    handleExcluirDenunciaExcluirCard={handleExcluirDenunciaExcluir}
                                    countDenunciasRecebidas={countDenunciasRecebidas} />
                            )}
                        />
                    </View>
                 

                </View>
            </ImageBackground>
        </PaperProvider>
    );
}
