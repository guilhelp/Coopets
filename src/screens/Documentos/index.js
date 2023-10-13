import { View, Text, ImageBackground, Image, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../config/Firebase';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

// Estilos
import styles from './styles';

// Expo
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_900Black } from '@expo-google-fonts/roboto';

// Importanto imagens
import Background from '../../assets/Background/Background.png'
import LogoBranca from '../../assets/Logo/Logo_FundoBranco.png';

export default function Documentos() {
    let [fontsLoaded, fontError] = useFonts({
        LuckiestGuy_400Regular,
        Roboto_900Black,
    });
    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [petData, setPetData] = useState(null);
    const [fullScreenImage, setFullScreenImage] = useState(null);

    // Função para buscar as URLs das imagens
    const fetchImageUrls = async () => {
        try {
            const responsavelDocRef = doc(db, 'responsaveis', auth.currentUser.uid);
            const responsavelDocSnap = await getDoc(responsavelDocRef);
            if (responsavelDocSnap.exists()) {
                const responsavelData = responsavelDocSnap.data();
                const petRef = responsavelData?.petID;

                if (petRef) {

                    const petDocSnap = await getDoc(petRef);
                    if (petDocSnap.exists()) {
                        const petData = petDocSnap.data();
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

    useEffect(() => {
        fetchImageUrls();
    }, []);

    const openFullScreenImage = (imageUrl) => {
        setFullScreenImage(imageUrl);
    };

    const closeFullScreenImage = () => {
        setFullScreenImage(null);
    };



    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <ImageBackground source={Background} style={styles.background}>
            <Header title="DOCUMENTOS" iconName="topic" />
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('BottomTabs')}>
                            <Ionicons name={'arrow-undo'} size={50} color="white" style={styles.returnButton} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => openFullScreenImage(petData?.pedigree)}>
                            <Text style={styles.title}>PEDIGREE</Text>
                            {petData?.pedigree && (
                                <Image style={styles.documentImage} source={{ uri: petData.pedigree }} />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => openFullScreenImage(petData?.vacina)}>
                            <Text style={styles.title}>VACINAS</Text>
                            {petData?.vacina && (
                                <Image style={styles.documentImage} source={{ uri: petData.vacina }} />
                            )}
                        </TouchableOpacity>
                        <Text style={styles.caixas}>Clique nas caixas para expandir as imagens</Text>
                        <View style={styles.textContainer}>
                            <Text style={styles.contacts}>CONTATOS</Text>
                            <Text style={styles.titleView}>Email</Text>
                            <View style={styles.email}>
                                <Text style={styles.emailText}>coopetsapp@gmail.com</Text>
                            </View>

                            <Text style={styles.titleView}>Telefone</Text>
                            <View style={styles.telefone}>
                                <Text style={styles.telefoneText}> (11) 97749-8984</Text>
                            </View>

                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Modal para exibir a imagem em tela cheia */}
            <Modal visible={!!fullScreenImage} transparent={true} onRequestClose={closeFullScreenImage}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={closeFullScreenImage}>
                        <Ionicons name="close-circle" size={80} color="#FFFFFF" style={styles.closeButtonIcon} />
                    </TouchableOpacity>
                    {fullScreenImage && (
                        <Image
                            style={styles.fullScreenImage}
                            source={{ uri: fullScreenImage }}
                            resizeMode="contain"
                        />
                    )}
                </View>
            </Modal>
        </ImageBackground>

    );
}