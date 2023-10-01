import React, { useState } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Estilos
import styles from './styles';
import Background from '../../assets/Background/Background.png'
import Header from '../../components/Header';
import { MaterialIcons } from '@expo/vector-icons';

// Expo
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_900Black } from '@expo-google-fonts/roboto';

export default function ConsultarDocumentos({ route }) {

    let [fontsLoaded, fontError] = useFonts({
        LuckiestGuy_400Regular,
        Roboto_900Black,
    });

    const navigation = useNavigation();
    const { petPedigree } = route.params
    const { petVac } = route.params

    const [fullScreenImage, setFullScreenImage] = useState(null);

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
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.returnButton}>
                            <MaterialIcons name={'keyboard-return'} size={55} color="white" style={styles.returnIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => openFullScreenImage(petPedigree)}>
                            <Text style={styles.title}>PEDIGREE</Text>
                            {petPedigree && (
                                <Image style={styles.documentImage} source={{ uri: petPedigree }} />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => openFullScreenImage(petVac)}>
                            <Text style={styles.title}>VACINAS</Text>
                            {petVac && (
                                <Image style={styles.documentImage} source={{ uri: petVac }} />
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
