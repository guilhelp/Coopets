import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
    // Configurando o Keyboard container
    container:{
       flex: 1,
    },
    // Configurações da página
    background:{
        width: wp('100%'),
        height: hp('110%'),

    },
    scrollContainer:{
        width: wp('100%'),
        height: hp('100%'),
    },
    // Configurando os inputs
    inputText:{
        fontFamily: 'Roboto_900Black',
        fontSize: wp('7%'),
        color: '#000000',
        margin: 28,
    },
    inputContainer:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    botaoAvancar:{
        width: wp('80'),
        height: hp('8%'),
        backgroundColor: '#573C35',
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        marginBottom: 100,
    },
    botaoAvancarText:{
        fontFamily: 'Roboto_900Black',
        fontSize: wp('6%'),
        color: '#FFF',
       
    },

    // Configurando o date modal picker
    datePickerButton:{
        width: 336,
        height: 61,
        color: '#000000',
        margin: 10,
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

});