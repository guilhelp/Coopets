import React, {useState, useEffect} from 'react';
import { ImageBackground, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

// Estilos
import styles from './styles';
import Background from '../../assets/Background/Background.png'
import Header from '../../components/Header';
import { MaterialIcons } from '@expo/vector-icons';

// Expo
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_900Black } from '@expo-google-fonts/roboto';

export default function ConsultarPerfil({ route }) {

    let [fontsLoaded, fontError] = useFonts({
        LuckiestGuy_400Regular,
        Roboto_900Black,
    });

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
    const { petTipo } = route.params
    const { petRaca } = route.params
    const { petCep } = route.params
    const [endereco, setEndereco] = useState('');
  
    const calculateAge = () => {
        const currentDate = new Date();
        const birthDate = new Date(petIdade); // Converter a string em um objeto Date
        
      
        const ageInMilliseconds = currentDate - birthDate;
        const ageInSeconds = ageInMilliseconds / 1000;
        const ageInMinutes = ageInSeconds / 60;
        const ageInHours = ageInMinutes / 60;
        const ageInDays = ageInHours / 24;
      
        if (ageInDays >= 365.25) {
          const ageInYears = ageInDays / 365.25;
          return `${Math.floor(ageInYears)} anos`;
        } else if (ageInDays >= 30.44) {
          const ageInMonths = ageInDays / 30.44;
          return `${Math.floor(ageInMonths)} meses`;
        } else {
          return `${Math.floor(ageInDays)} dias`;
        }
      };
    
    // Use calculateAge() para obter a idade formatada
    const idadeFormatada = calculateAge();
    console.log(idadeFormatada); // Exibirá a idade formatada


    const getPetAddress = async (petCep) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${petCep}/json/`);
            const data = response.data;
    
            if (!data.erro) {
                // Verifique se não há erros na resposta
                const endereco = `${data.bairro}, ${data.localidade}, ${data.uf}`;
                return endereco;
            } else {
                return 'Endereço não encontrado';
            }
        } catch (error) {
            console.error('Erro ao buscar endereço:', error);
            return 'Erro ao buscar endereço';
        }
    };
    
    // Use getPetAddress() para obter o endereço com base no CEP
    useEffect(() => {
        // Use getPetAddress() para obter o endereço com base no CEP
        getPetAddress(petCep)
            .then((enderecoObtido) => {
                setEndereco(enderecoObtido); // Atualize o estado com o endereço
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);


    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <ImageBackground source={Background} style={styles.background}>
            <Header title={petNome} iconName="pets" />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('BottomTabs')} style={styles.returnButton}>
                            <MaterialIcons name={'keyboard-return'} size={55} color="white" style={styles.returnIcon} />
                        </TouchableOpacity>
                    </View>

                    <Image source={{ uri: petImage }} style={styles.imagemPerfil} />
                    <Text style={styles.nomePerfil}>{petNome}</Text>
                    <View>

                        <Text style={styles.titleView}>Bio</Text>
                        <View style={styles.descricaoPerfil}>
                            <Text style={styles.getTextBio}>{petBio}</Text>
                        </View>
                   

                        <View style={styles.sexoContainer}>
                            <Text style={styles.titleView}>Sexo</Text>
                            <View style={styles.viewSexo}>
                                <Text style={styles.getText}>{petSexo}</Text>
                            </View>
                        </View>

                        <View style={styles.idadeContainer}>
                            <Text style={styles.titleView}>Idade</Text>
                            <View style={styles.viewIdade}>
                                <Text style={styles.getText}>{idadeFormatada}</Text>
                            </View>
                        </View>

                        <View style={styles.tipoContainer}>
                            <Text style={styles.titleView}>Tipo</Text>
                            <View style={styles.viewSexo}>
                                <Text style={styles.getText}>{petTipo}</Text>
                            </View>
                        </View>

                        <View style={styles.racaContainer}>
                            <Text style={styles.titleView}>Raça</Text>
                            <View style={styles.viewIdade}>
                                <Text style={styles.getText}>{petRaca}</Text>
                            </View>
                        </View>

                    </View>
                    <View style={styles.tituloInfo}>
                        <Text style={styles.tituloText}>Local</Text>
                    </View>
                    <View style={styles.localizacaoPerfil}>
                        <Text style={styles.getTextLocal}>{endereco}</Text>
                    </View>
                    <View style={styles.buttonScreensContainer}>
                        <TouchableOpacity style={styles.buttonDocs} onPress={() => navigation.navigate('ConsultarDocumentos', { petPedigree, petVac })}>
                            <Text style={styles.buttonText}>Documentos</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </ImageBackground>

    );
}