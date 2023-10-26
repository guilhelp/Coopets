// Importando o React
import React, { useState, useEffect } from 'react';

// Importando os componentes do React
import { 
    View, 
    Text, 
    ImageBackground, 
    Image, 
    TouchableOpacity, 
    Modal, 
    ScrollView 
} from 'react-native';

// Importando as variáveis do Firebase
import { db, auth } from '../../config/Firebase';


// Importando as funções do Firebase

// Firestore
import { doc, getDoc } from 'firebase/firestore';

// Importando os componentes do react navigation
import { useNavigation } from '@react-navigation/native';

// Importando os componentes
import Header from '../../components/Header';

// Importando os ícones
import { Ionicons } from '@expo/vector-icons';

// Importando os estilos
import {styles} from './styles';

// Importando as fontes
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_900Black } from '@expo-google-fonts/roboto';

// Importanto imagens
import Background from '../../assets/Background/Background.png'

export default function Documentos() {

    let [fontsLoaded, fontError] = useFonts({
        LuckiestGuy_400Regular,
        Roboto_900Black,
    }); // Estado que armazena as fontes do projeto

    const navigation = useNavigation(); // Variável de navegação

    // Estado que define se a tela esta carregando ou não
    const [loading, setLoading] = useState(true);

    // Estado que armazena as informações do pet
    const [petData, setPetData] = useState(null);

    // Estado que armazenará quando a imagem deve aparecer ou não
    const [fullScreenImage1, setFullScreenImage1] = useState(null);

     // Estado que armazenará quando a imagem deve aparecer ou não
     const [fullScreenImage2, setFullScreenImage2] = useState(null);

    // Função para buscar as URLs das imagens
    const fetchImageUrls = async () => {
        try {
            // Busca o documento do responsável logado
            const responsavelDocRef = doc(db, 'responsaveis', auth.currentUser.uid);
            const responsavelDocSnap = await getDoc(responsavelDocRef);
            if (responsavelDocSnap.exists()) {
                const responsavelData = responsavelDocSnap.data();
                const petRef = responsavelData?.petID;
                // Busca o pet que pertence ao responsável logado
                if (petRef) {

                    const petDocSnap = await getDoc(petRef);
                    if (petDocSnap.exists()) {
                        const petData = petDocSnap.data();
                        // Define o estado com as informações do pet
                        setPetData(petData);
                    } else {
                        setPetData(null);
                    }
                } else {
                    setPetData(null);
                }
            } else {
                setPetData(null);
            }
        } catch (error) {
            console.log('Erro ao buscar as URLs das imagens:', error);
            setPetData(null);
        } finally {
            setLoading(false);
        }
    };

    // Chama a função de buscar as imagens
    useEffect(() => {
        fetchImageUrls();
    }, []);

     // Função para abrir a imagem e aparecer na tela
    const openFullScreenImage1 = (imageUrl) => {
        setFullScreenImage1(imageUrl);
    };

    // Função para fechar a imagem e desaparecer da tela
    const closeFullScreenImage1 = () => {
        setFullScreenImage1(null);
    };

     // Função para abrir a imagem e aparecer na tela
     const openFullScreenImage2 = (imageUrl) => {
        setFullScreenImage2(imageUrl);
    };

    // Função para fechar a imagem e desaparecer da tela
    const closeFullScreenImage2 = () => {
        setFullScreenImage2(null);
    };

    if (!fontsLoaded && !fontError) {
        return null;
    } // Condição caso as fontes não carreguem

    return (
        <ImageBackground source={Background} style={styles.background}>
            <Header title="DOCUMENTOS" iconName="folder-shared" />
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('BottomTabs')} style={styles.returnButton}>
                            <Ionicons name={'arrow-undo'} size={40} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => openFullScreenImage1(petData?.pedigree)}>
                            <Text style={styles.title}>PEDIGREE</Text>
                            {petData?.pedigree && (
                                <Image style={styles.documentImage} source={{ uri: petData.pedigree }} />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => openFullScreenImage2(petData?.vacina)}>
                            <Text style={styles.title}>VACINAS</Text>
                            {petData?.vacina && (
                                <Image style={styles.documentImage} source={{ uri: petData.vacina }} />
                            )}
                        </TouchableOpacity>
                        <Text style={styles.caixas}>Clique nas caixas para expandir as imagens</Text>
                        <View style={styles.textContainer}>
                            <Text style={styles.contacts}>CONTATOS</Text>
                            <Text style={styles.titleView}>Email: coopetsapp@gmail.com</Text>
                            <Text style={styles.titleView}>Telefone: (11) 97749-8984</Text>
                            

                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Modal para exibir a imagem em tela cheia */}
            <Modal visible={!!fullScreenImage1} transparent={true} onRequestClose={closeFullScreenImage1}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={closeFullScreenImage1}>
                        <Ionicons name="close-circle" size={80} color="#FFFFFF" style={styles.closeButtonIcon} />
                    </TouchableOpacity>
                    {fullScreenImage1 && (
                        <Image
                            style={styles.fullScreenImage}
                            source={{ uri: fullScreenImage1 }}
                            resizeMode="contain"
                        />
                    )}
                </View>
            </Modal>

            {/* Modal para exibir a imagem em tela cheia */}
            <Modal visible={!!fullScreenImage2} transparent={true} onRequestClose={closeFullScreenImage2}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={closeFullScreenImage2}>
                        <Ionicons name="close-circle" size={80} color="#FFFFFF" style={styles.closeButtonIcon} />
                    </TouchableOpacity>
                    {fullScreenImage2 && (
                        <Image
                            style={styles.fullScreenImage}
                            source={{ uri: fullScreenImage2 }}
                            resizeMode="contain"
                        />
                    )}
                </View>
            </Modal>
        </ImageBackground>

    );
}