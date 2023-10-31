import { StyleSheet, Dimensions } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#573C35'
    },
    fundoBranco: {
        flex: 5,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 20, // Raio superior esquerdo
        borderTopRightRadius: 20, // Raio superior direito
        borderBottomLeftRadius: 0,  // Raio inferior esquerdo
        borderBottomRightRadius: 0, // Raio inferior direito
        paddingTop: 30,
        marginTop: 20,
    },

    cabecalhoPagina: {
        marginTop: 30,
  
        top: 0,
        left: 0,
        width: '100%',
        height: 170,
        flexDirection: 'row',
        backgroundColor: '#573C35',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,

    },
    petImage: {
        width: 80,
        height: 80,
        borderRadius: 200,
        margin: 20,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    botoesContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    botoesContainerOption: {

    },
    returnButton: {
        width: 60,
        height: 60,
        borderRadius: 200,
        backgroundColor: '#573C35',
        marginLeft: 15,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    optionButton: {
        width: 60,
        height: 60,
        borderRadius: 200,
        backgroundColor: '#573C35',
        top: 20,
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
        paddingHorizontal: 0,
        right: 50,
        marginTop: 10,
    },
    returnButtonOverlapping: {
        position: 'absolute',
        top: 20, // Ajuste a posição vertical conforme necessário
        left: 5, // Ajuste a posição horizontal conforme necessário
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: '#573C35',
        width: wp('100%'),
        height: 100,
        borderTopLeftRadius: 20, // Raio superior esquerdo
        borderTopRightRadius: 20,
        paddingTop: 10,
        paddingHorizontal: 10,
        
    },
    input: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        height: 60, // Altura do TextInput
        borderWidth: 3,
        borderColor: 'gray',
        borderRadius: 20,
        fontFamily: 'Roboto_900Black',
        fontSize: 18,
        paddingLeft: 30,
        paddingRight: 60,
    },
    sendButton: {
        top: 5,
        width: 65,
        height: 65,
        borderRadius: 200,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 10,
    },

    messageContainer: {
        padding: 12,
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