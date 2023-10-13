// Importando o React
import React, { useState } from 'react';

// Importando os componentes do React
import {
    View,
    Text,
    ImageBackground,
    Linking,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Alert
} from 'react-native';

// Importando o componente de dropdown do react-native-select-dropdown
import SelectDropdown from 'react-native-select-dropdown';

// Importando o componente de DateTimePicker do react-native-modal-datetime-picker
import DateTimePickerModal from 'react-native-modal-datetime-picker';

// Importando as funções do date-fns
import { format, isAfter, isBefore } from 'date-fns';

// Importando os componentes do react navigation
import { useRoute, useNavigation } from '@react-navigation/native';

// Importando a biblioteca axios para requisições
import axios from 'axios';

// Estilos
import { styles } from './styles';

// Importando os componentes do react-native-paper
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

// Importando ícones
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Expo
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_900Black } from '@expo-google-fonts/roboto';

// Importando imagens
import Background from '../../../assets/Background/Background.png'

// Importando componentes
import Input from '../../../components/Input';
import Header from '../../../components/Header';

// Configurando cores do react native paper
const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'black',
    },
};

export default function CadastrarPet() {
    let [fontsLoaded, fontError] = useFonts({
        LuckiestGuy_400Regular,
        Roboto_900Black,
    }); // Estado que armazena as fontes do projeto

    const navigation = useNavigation(); // Variável de navegação
    const route = useRoute(); // Variável que envia parâmtros pelas rotas


    const { dadosResp } = route.params; // Recebe os parâmetros

    // Estados que armazenam as informações do pet
    const [nomePet, setNomePet] = useState('');
    const [sexo, setSexo] = useState('');
    const [tipo, setTipo] = useState('');
    const [raca, setRaca] = useState('');
    const [cor, setCor] = useState('');
    const [dataNascimentoPet, setDataNascimentoPet] = useState('');
    const [cep, setCep] = useState('');

    // Estado que armazenara se o datepicker estará visivel ou não
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);

    // Estado que armazenara se o dropdown das raças estará visivel ou não
    const [showRacaDropdown, setShowRacaDropdown] = useState(false);

    // Estado que armazena as opções de raça
    const [racaOptions, setRacaOptions] = useState([])

    // Variável que armazena as opções de sexo
    const sexoOptions = ['Macho', 'Fêmea'];

    // Condição, para mostrar diferentes tipos de raça dependendo do tipo de pet
    const updateRacaOptions = (selectedTipo) => {
        if (selectedTipo === 'Cão') {
            setRacaOptions(['Pug', 'Shih Tzu', 'Bulldog Francês', 'Pomerânia', 'Golden Retriever']);
        } else if (selectedTipo === 'Gato') {
            setRacaOptions(['Persa', 'Siamês', 'Angorá', 'Ashera', 'Sphynx']);
        } else {
            setRacaOptions([]); // Se nenhum tipo estiver selecionado, não há opções de raça
        }
    };

    // Função para mostrar o DatePicker
    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    // Função para esconder o DatePicker
    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };

    // Função para confirmar uma data no DatePicker
    const handleConfirm = (date) => {
        hideDatePicker();
        setDataNascimentoPet(date);
    };

    // Variável que armazena a Data atual
    const maxDate = new Date();

    // Função para abrir a URL do correio para buscar um CEP
    const handleOpenWebPage = () => {
        const url = 'https://buscacepinter.correios.com.br/app/endereco/index.php';
        Linking.openURL(url);
    };

    // Lógica para adicionar uma idade máxima para o pet
    const limiteIdade = new Date();
    limiteIdade.setFullYear(limiteIdade.getFullYear() - 40);

    // Lógica para adicionar uma idade mínima para o pet
    const minIdade = new Date();
    minIdade.setFullYear(minIdade.getFullYear() - 2);

    // Função para validar um CEP
    const validarCep = async (cep) => {

        const cepLimpo = cep.replace(/\D/g, ''); // Remove qualquer caractere não numérico do CEP

        if (cepLimpo.length !== 8) { // Verifica se o CEP tem exatamente 8 dígitos
            return false; // Retorna que o CEP é inválido
        }

        try {
            // Faz uma requisição pela biblioteca axios para verificar se o CEP existe
            const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);

            // Verifica se o serviço de consulta de CEP retornou um resultado válido
            if (response.data.erro) {
                return false; // Retorna que o CEP é inválido
            }

            return true; // Retorna que CEP é válido
        } catch (error) {
            console.error('Erro ao validar CEP:', error);
            return false; // Erro na requisição
        }
    };

    // Função que valida diversos campos antes de avançar para a próxima tela
    const checkFieldsAndNavigate = async () => {

        // Verifica se todos os campos foram preenchidos
        if (!nomePet || !sexo || !tipo || !raca || !cor || !dataNascimentoPet || !cep) {
            alert('Por favor, preencha todos os campos antes de avançar.');
            return;
        }

        // Verifica se o cep tem 8 dígitos
        if (cep.length !== 8) {
            Alert.alert('CEP Inválido', 'O CEP deve conter exatamente 8 dígitos.');
            return;
        }

        // Armazena a Data de Nascimento do pet
        const dataNascimentoPetDate = new Date(dataNascimentoPet);

        // Verifica se a idade é superior a 40 anos
        if (isBefore(dataNascimentoPetDate, limiteIdade)) {
            alert('A idade do pet não pode ser superior a 40 anos.');
            return;
        }

        // Verifica se a idade é inferior a 2 anos
        if (isAfter(dataNascimentoPetDate, minIdade)) {
            alert('A idade do pet deve ser superior a 2 anos.');
            return;
        }

        try {
            // Valida o cep chamando a função validarCep
            const isValid = await validarCep(cep);
            if (!isValid) {
                Alert.alert('CEP Inválido', 'O CEP digitado não é válido. Verifique o número digitado.');
                return;
            }

            // Armazena todos os dados obtidos para enviar para a próxima tela
            const dadosPet1 = {
                nomePet,
                sexo,
                tipo,
                raca,
                cor,
                dataNascimentoPet: dataNascimentoPet.toISOString(),
                cep,
            };

            // Envia os dados tanto do responsável quanto do pet obtidos para a tela de CadastrarPet2
            navigation.navigate('CadastrarPet2', { dadosResp, dadosPet1 });

        } catch (error) {
            console.error('Erro ao validar CEP:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao validar o CEP. Verifique sua conexão com a internet e tente novamente.');
        }
    }

    if (!fontsLoaded && !fontError) {
        return null;
    } // Condição caso as fontes não carreguem

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
                                    updateRacaOptions(selectedItem); // Atualiza as opções de raça com base no tipo selecionado
                                    setShowRacaDropdown(true); // Mostra o dropdown de raças quando um tipo é selecionado
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                                rowTextForSelection={(item, index) => item}
                                dropdownIconPosition="right"
                                defaultButtonText="Selecione o Tipo"
                                buttonStyle={styles.dropdownButton}
                                buttonTextStyle={styles.dropdownButtonText}
                                dropdownStyle={styles.dropdownContainer}
                            />

                            {showRacaDropdown && ( // Condição para mostrar o dropdown de raças somente depois de escolher um tipo de pet
                                <SelectDropdown
                                    data={racaOptions} 
                                    onSelect={(selectedItem, index) => setRaca(selectedItem)} // Atualiza a raça selecionada
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
                                maxLength={8}
                            />

                            <TouchableOpacity style={styles.naoSabeCEP} onPress={handleOpenWebPage}>
                                <MaterialCommunityIcons name="map-marker-radius" size={30} color="black" />
                                <Text style={styles.naoSabeCEPText}>Não sabe seu Cep?</Text>
                            </TouchableOpacity>


                            <TouchableOpacity
                                style={styles.botaoAvancar}
                                onPress={async () => {
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