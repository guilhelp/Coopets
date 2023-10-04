import { StyleSheet, Dimensions } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    background: {
        width: wp('100%'),
        height: hp('105%'),
    },
    cabecalhoPagina: {
        zIndex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#573C35',
        width: wp('100%'),
        height: hp('17%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    petImage: {
        width: wp('20%'),
        height: hp('10%'),
        borderRadius: 200,
        margin: 20,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    botoesContainer:{
        flexDirection: 'row',
        marginBottom: 20,
    },
    returnButton: {
        width: 60,
        height: 60,
        borderRadius: 200,
        backgroundColor: '#573C35',
        marginLeft: 20,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    optionButton:{
        width: 60,
        height: 60,
        borderRadius: 200,
        backgroundColor: '#573C35',
        marginLeft: 250,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    petName: {
        fontFamily: 'Roboto_900Black',
        fontSize: wp('10%'),
        color: '#FFFFFF',
        marginBottom: 1,
    },
    petDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        right: 20,
        marginTop: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#573C35',
        width: wp('100%'),
        height: hp('10%'),
        marginBottom: 33
      
    },
    input: {
        backgroundColor: '#FFFFFF',
        width: 300,
        height: 50,
        borderRadius: 17,
        fontFamily: 'Roboto_900Black',
        fontSize: 15,
        paddingLeft: 10,
        
    },
    sendButton: {
        backgroundColor: '#573C35',
        width: 65,
        height: 65,
        borderRadius: 200,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
    sendText: {
        color: '#FFFFFF',
        fontFamily: 'Roboto_900Black',
    },
    messageContainer: {
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 20,
        maxWidth: '100%',
        borderRadius: 30,
        alignSelf: 'flex-end',

    },

    myMessage: {

        backgroundColor: 'white', // Cor de fundo para as mensagens do usuário logado
    },

    otherMessage: {
        backgroundColor: '#EEE1D3', // Cor de fundo para as mensagens do usuário que recebe
        alignSelf: 'flex-start',

    },

    messageText: {
        fontFamily: 'Roboto_900Black',
        fontSize: wp('4%'),
        color: '#000000', // Cor do texto das mensagens

    },

    myMessageText: {
        textAlign: 'right',
        color: '#000000'
    },

    otherMessageText: {
        textAlign: 'left',

    },
    scrollMsg: {
        width: '100%',
        height: '100%',
    }






});