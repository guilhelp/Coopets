import { View, Text, ImageBackground, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

// Estilos
import { styles } from './styles';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

// Expo
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_900Black } from '@expo-google-fonts/roboto';
import * as ImagePicker from 'expo-image-picker';

// Importanto imagens
import Background from '../../../assets/Background/Background.png'

// Importanto componentes
import Header from '../../../components/Header';


// Configurando cores do react native paper
const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'black', // Aqui você define a cor desejada para o rótulo
    },
};


export default function CadastrarPet2() {
    let [fontsLoaded, fontError] = useFonts({
        LuckiestGuy_400Regular,
        Roboto_900Black,
    });

    const navigation = useNavigation();
    const route = useRoute();
    const { dadosResp, dadosPet1 } = route.params;

    const [pedigreeImage, setPedigreeImage] = useState(null);
    const [vacinaCardImage, setVacinaCardImage] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Desculpe, precisamos das permissões da biblioteca de mídia para isso funcionar!');
            }
        })();
    }, []);

    const selectImage = async (type) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            if (type === 'pedigree') {
                setPedigreeImage(result.assets[0].uri);
                pedigreeImageUrl = result.assets[0].uri; // Adicione a URL à propriedade do objeto
            } else if (type === 'vacinaCard') {
                setVacinaCardImage(result.assets[0].uri);
                vacinaCardImageUrl = result.assets[0].uri; // Adicione a URL à propriedade do objeto
            }
        }
    };

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <PaperProvider theme={theme}>
            <ImageBackground source={Background} style={styles.background}>
                <Header title="PET" iconName="pets" />
                <KeyboardAvoidingView
                    behavior={'padding'}
                    style={styles.container}>
                    <ScrollView style={styles.scrollContainer}>
                    <Text style={styles.inputText}>DOCUMENTOS</Text>
                    <View style={styles.inputContainer}>

                        {/* Input de imagem para o pedigree */}
                        <Text style={styles.inputTitle}>PEDIGREE</Text>
                        <TouchableOpacity
                            style={styles.imageInput}
                            onPress={() => selectImage('pedigree')}
                        >
                            {pedigreeImage ? (
                                <Image source={{ uri: pedigreeImage }} style={styles.selectedImage} />
                            ) : (
                                <Icon name="plus-circle" size={50} color="black" style={styles.buttonImage} />
                            )}
                        </TouchableOpacity>

                        {/* Input de imagem para a carteira de vacinação */}
                        <Text style={styles.inputTitle}>CARTEIRA DE VACINAÇÃO</Text>
                        <TouchableOpacity
                            style={styles.imageInput}
                            onPress={() => selectImage('vacinaCard')}
                        >
                            {vacinaCardImage ? (
                                <Image source={{ uri: vacinaCardImage }} style={styles.selectedImage} />
                            ) : (
                                <Icon name="plus-circle" size={50} color="black" />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.botaoAvancar}
                            onPress={() => {
                                if (pedigreeImage && vacinaCardImage) {
                                    const imagensPet = {
                                        imagem1: pedigreeImage,
                                        imagem2: vacinaCardImage,
                                      };
                                    navigation.navigate('CadastrarPet3', { dadosResp, dadosPet1, dadosPet2: imagensPet });
                                } else {
                                    alert('Por favor, selecione as duas imagens antes de avançar.');
                                }
                            }}
                        >
                            <Text style={styles.botaoAvancarText}>Avançar</Text>
                        </TouchableOpacity>
                    </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </ImageBackground>
        </PaperProvider>

    );
}