import { View, Text, ImageBackground, Linking, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useState } from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

// Estilos
import { styles } from './styles';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

// Expo
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_900Black } from '@expo-google-fonts/roboto';

// Importanto imagens
import Background from '../../../assets/Background/Background.png'

// Importanto componentes
import Input from '../../../components/Input';
import Header from '../../../components/Header';


// Configurando cores do react native paper
const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'black', // Aqui você define a cor desejada para o rótulo
    },
};


export default function CadastrarPet() {
    let [fontsLoaded, fontError] = useFonts({
        LuckiestGuy_400Regular,
        Roboto_900Black,
    });

    const navigation = useNavigation();
    const route = useRoute();
    const { dadosResp } = route.params;

    const [nomePet, setNomePet] = useState('');
    const [sexo, setSexo] = useState('');
    const [tipo, setTipo] = useState('');
    const [raca, setRaca] = useState('');
    const [cor, setCor] = useState('');
    const [dataNascimentoPet, setDataNascimentoPet] = useState('');
    const [cep, setCep] = useState('');
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);

    const [showRacaDropdown, setShowRacaDropdown] = useState(false);
    const [racaOptions, setRacaOptions] = useState([])
    const sexoOptions = ['Macho', 'Fêmea'];

    const updateRacaOptions = (selectedTipo) => {
        if (selectedTipo === 'Cão') {
            setRacaOptions(['Pug', 'Shih Tzu', 'Bulldog Francês', 'Pomerânia', 'Golden Retriever']);
        } else if (selectedTipo === 'Gato') {
            setRacaOptions(['Persa', 'Siamês', 'Angorá', 'Ashera', 'Sphynx']);
        } else {
            setRacaOptions([]); // Se nenhum tipo estiver selecionado, não há opções de raça
        }
    };

    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };

    const handleConfirm = (date) => {
        hideDatePicker();
        setDataNascimentoPet(date);
    };

    const maxDate = new Date(); // Data atual

    const handleOpenWebPage = () => {
        const url = 'https://buscacepinter.correios.com.br/app/endereco/index.php'; // Substitua pela URL desejada
        Linking.openURL(url);
    };

    const validarCep = async (cep) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);


            return true; // CEP válido

        } catch (error) {
            console.error('Erro ao validar CEP:', error);
            return false; // Erro na requisição
        }
    };


    const checkFieldsAndNavigate = () => {

        if (!nomePet || !sexo || !tipo || !raca || !cor || !dataNascimentoPet || !cep) {
            alert('Por favor, preencha todos os campos antes de avançar.');
            return;
        }
        const dadosPet1 = {
            nomePet,
            sexo,
            tipo,
            raca,
            cor,
            dataNascimentoPet: dataNascimentoPet.toISOString(),
            cep
        };

        navigation.navigate('CadastrarPet2', { dadosResp, dadosPet1 });
    }

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

                        <Text style={styles.inputText}>CADASTRAR</Text>
                        <View style={styles.inputContainer}>

                            <Input
                                label="Nome do Pet"
                                placeholder="Digite o Nome do Pet"
                                value={nomePet}
                                onChangeText={setNomePet}
                            />

                            <SelectDropdown
                                data={sexoOptions}
                                onSelect={(selectedItem, index) => setSexo(selectedItem)}
                                buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                                rowTextForSelection={(item, index) => item}
                                dropdownIconPosition="right"
                                defaultButtonText="Selecione o Sexo"
                                buttonStyle={styles.dropdownButton}
                                buttonTextStyle={styles.dropdownButtonText}
                                dropdownStyle={styles.dropdownContainer}
                            />

                            <SelectDropdown
                                data={['Cão', 'Gato']}
                                onSelect={(selectedItem, index) => {
                                    setTipo(selectedItem);
                                    updateRacaOptions(selectedItem); // Atualize as opções de raça com base no tipo selecionado
                                    setShowRacaDropdown(true); // Mostrar o dropdown de raças quando um tipo é selecionado
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                                rowTextForSelection={(item, index) => item}
                                dropdownIconPosition="right"
                                defaultButtonText="Selecione o Tipo"
                                buttonStyle={styles.dropdownButton}
                                buttonTextStyle={styles.dropdownButtonText}
                                dropdownStyle={styles.dropdownContainer}
                            />

                            {showRacaDropdown && (
                                <SelectDropdown
                                    data={racaOptions} // Use o estado racaOptions como fonte de dados
                                    onSelect={(selectedItem, index) => setRaca(selectedItem)} // Atualize a raça selecionada
                                    buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                                    rowTextForSelection={(item, index) => item}
                                    dropdownIconPosition="right"
                                    defaultButtonText="Selecione a Raça"
                                    buttonStyle={styles.dropdownButton}
                                    buttonTextStyle={styles.dropdownButtonText}
                                    dropdownStyle={styles.dropdownContainer}
                                />
                            )}

                            {!showRacaDropdown && (
                                <Text style={styles.infoText}>Por favor, selecione um tipo antes de escolher uma raça.</Text>
                            )}

                            <Input
                                label="Cor do Pet"
                                placeholder="Digite a cor do Pet"
                                value={cor}
                                onChangeText={setCor}
                            />


                            <TouchableOpacity onPress={showDatePicker} style={styles.datePickerButton}>
                                <Text style={styles.datePickerText}>
                                    {dataNascimentoPet ? format(dataNascimentoPet, 'dd/MM/yyyy') : 'Data de Nascimento'}
                                </Text>
                            </TouchableOpacity>

                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                                maximumDate={maxDate}
                            />

                            <Input
                                label="CEP"
                                placeholder="Digite o CEP"
                                value={cep}
                                onChangeText={setCep}
                                keyboardType="numeric"
                                maxLength={9}
                            />

                            <TouchableOpacity style={styles.naoSabeCEP} onPress={handleOpenWebPage}>
                                <Icon name="map-marker" size={25} color="black" />
                                <Text style={styles.naoSabeCEPText}>Não sabe seu Cep?</Text>
                            </TouchableOpacity>


                            <TouchableOpacity
                                style={styles.botaoAvancar}
                                onPress={async () => {
                                    if (cep.length === 9) {
                                        let isValid = false;
                                        try {
                                            isValid = await validarCep(cep);
                                        } catch (error) {
                                            console.error('Erro ao validar CEP:', error);
                                        }

                                        if (!isValid) {
                                            alert('CEP inválido. Verifique o número digitado.');
                                            return; // Não avança caso o CEP seja inválido
                                        }
                                    }

                                    if (!nomePet || !sexo || !tipo || !raca || !cor || !dataNascimentoPet || !cep) {
                                        alert('Por favor, preencha todos os campos antes de avançar.');
                                        return;
                                    }

                                    checkFieldsAndNavigate(); // Avança somente se os campos estiverem preenchidos e o CEP for válido
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