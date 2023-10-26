import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
    container: {
      backgroundColor: '#573C35',
      padding: 10,
      borderBottomWidth: 1,
      borderColor: '#8E8E8E',
      borderWidth: 5,
      borderColor: '#FFF',
      borderRadius: 20,
      margin: 30,
      marginTop: 10,
      width: 330,
      height: 320,
    },
    infoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      marginTop: 10,
    },
    imagemPerfil: {
      width: 60,
      height: 60,
      borderRadius: 1000,
      marginLeft: 10,
    },
    nomePerfil: {
      marginLeft: 10,
      color: 'white',
      fontSize: wp('5%'),
      fontWeight: 'bold'
    },
    motivo: {
      marginLeft: 10,
      color: 'white',
      fontSize: wp('4%'),
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 10,
    },
    containerBotoes: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
      alignItems: 'center',
      
    },
    button: {
      backgroundColor: 'white',
      padding: 8,
      borderRadius: 17,
      width: 107,
      height: 42,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 20,
    },
    buttonText: {
      color: '#000000',
      fontFamily: 'Roboto_900Black',
      fontSize: wp('4%'),
    },
    buttonLixeira: {
      padding: 8,
      borderRadius: 5,
      marginLeft: 250,
      position: 'absolute'
    },
    idText: {
      marginTop: 10,
      color: '#FFF',
      fontFamily: 'Roboto_900Black',
      fontSize: wp('3%'),
      marginLeft: 5,
    },
  });