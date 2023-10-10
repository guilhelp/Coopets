import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    background: {
        width: wp('100%'),
        height: hp('110%'),
    },

    // Configurando o texto de título
    inputText: {
        fontFamily: 'Roboto_900Black',
        fontSize: wp('7%'),
        color: '#000000',
        margin: 28,
    },
    inputContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        
    },

    // Configurando os dropdown
    dropdownButton: {
        width: 336,
        height: 61,
        backgroundColor: '#FFF',
        paddingHorizontal: 10,
        borderRadius: 5,
        color: '#000000',
        margin: 5,
        fontSize: 20,
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: '#717171',
    },
    dropdownButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'left'
    },
    customButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        marginLeft: 10,
    },
    dropdownContainer: {
        width: 336,
        height: 100,
        marginTop: '-10%',
        borderRadius: 5,
        backgroundColor: 'white',
        elevation: 5,
    },

    // Text informativo para o usuário
    infoText:{
        fontFamily: 'Roboto_900Black',
        fontSize: wp('3.3%'),
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textDecorationLine: 'underline'
    },

    // Configurando botao não sabe CEP
    naoSabeCEP: {
        margin: 5,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    naoSabeCEPText: {
        fontSize: wp('5%'),
        fontFamily: 'Roboto_900Black',
        marginLeft: 10,
        textDecorationLine: 'underline',
    },

    // Configurando o date modal picker
    datePickerButton:{
        width: 336,
        height: 61,
        color: '#000000',
        margin: 5,
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: '#FFF',
        borderWidth: 1,
        justifyContent: 'center',
        borderColor: '#717171',
        borderRadius: 5,
    },
    datePickerText:{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        marginLeft: 10,
    },

    // Botão Avançar
    botaoAvancar: {
        width: wp('80'),
        height: hp('8%'),
        backgroundColor: '#573C35',
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        marginBottom: 100,
    },
    botaoAvancarText: {
        fontFamily: 'Roboto_900Black',
        fontSize: wp('6%'),
        color: '#FFF',
    },


});