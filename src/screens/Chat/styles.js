import { StyleSheet, Dimensions } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

export const styles = StyleSheet.create ({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    fundoBranco:{
        width: wp('100%'),
        height: hp('87%'),
        marginTop: 150,
        backgroundColor: '#FFF',
        borderRadius: 30,
    },
    background: {
        width: wp('100%'),
        height: hp('105%'),
    },
    cabecalhoPagina: {
        position: 'absolute', // Defina position como 'absolute'
        top: 0, // Ajuste a posição superior conforme necessário
        left: 0, // Ajuste a posição esquerda conforme necessário
        width: '100%', // Garanta que ocupe toda a largura da tela
        height: 170, // Garanta que ocupe toda a altura da tela
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#573C35',

        alignItems: 'center',
    },
    petImage: {
        width: 80,
        height: 80,
        borderRadius: 200,
        margin: 20,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    botoesContainer:{
        flexDirection: 'row',
        marginBottom: 20,
    },
    botoesContainerOption:{
        marginLeft: 60,
        marginTop: 15,
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
 
      
        position: 'absolute',
        top: -20,
       

       
    },
    petName: {
        fontFamily: 'Roboto_900Black',
        fontSize: wp('6%'),
        color: '#FFFFFF',
        marginBottom: 1,
    },
    petDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        right: 20,
        marginTop: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: '#573C35',
        width: wp('100%'),
        height: hp('20%'),
        top: '15%',
        paddingTop: 10,
        paddingHorizontal: 10, // Adicione espaço à esquerda e à direita para melhor aparência
      },
      input: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        height: 70,
        borderWidth: 3,
        borderColor: 'gray',
        borderRadius: 20,
        fontFamily: 'Roboto_900Black',
        fontSize: 18,
        paddingLeft: 30,
      },
      sendButton: {
        top: 10,
        width: 65,
        height: 65,
        borderRadius: 200,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute', // Defina position como 'absolute'
        right: 10, // Ajuste a posição para o canto direito
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
        maxWidth: '100%',
        alignItems: 'center',
        backgroundColor: '#573C35', // Cor de fundo para as mensagens do usuário logado
    },

    otherMessage: {
        backgroundColor: '#E5C9BF', // Cor de fundo para as mensagens do usuário que recebe
        alignSelf: 'flex-start',

    },

    messageText: {
        fontFamily: 'Roboto_900Black',
        fontSize: wp('4%'),
        color: '#FFF', // Cor do texto das mensagens

    },

    myMessageText: {
        textAlign: 'right',
        color: '#000000'
    },

    otherMessageText: {
        textAlign: 'left',

    },
    





});