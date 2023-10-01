import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    width: wp('100%'),
    height: hp('110%'),
  },
  returnButton: {
    width: 60,
    height: 60,
    borderRadius: 200,
    backgroundColor: '#573C35',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 20,
},

  // Botões das imagens
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#573C35', // Altera a cor do cabeçalho para marrom
    borderColor: '#EEE1D3',
    borderWidth: 3,
    borderRadius: 15,
    width: 350,
    height: 110,
  },
  title: {
    fontSize:  wp('8%'),
    fontFamily: 'Roboto_900Black',
    color: '#FDF7F2', // Altera a cor do texto para branco
  },
  caixas:{
    fontFamily: 'Roboto_900Black',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginTop: 10,
    marginLeft: 10,
  },

  // Contatos
  contacts: {
    paddingTop: 30,
    fontFamily: 'Roboto_900Black',
    fontSize: wp('8%'),
    marginBottom: 20,
    color: '#000000',
  },
  titleView: {
    fontFamily: 'Roboto_900Black',
    fontSize: wp('5%'),
    color: '#000000',
  },
  email:{
    alignItems: 'center',
    justifyContent: 'center',
    width: 340,
    height: 50,
    borderWidth: 3,
    borderColor: "#573C35",
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    marginBottom: 20,
    marginTop: 10,
  },
  emailText: {
    fontFamily: 'Roboto_900Black',
    fontSize: wp('5%'),
    color: '#000000',
    padding: 10,
    textAlign: 'center'
  },
  telefone:{
    alignItems: 'center',
    justifyContent: 'center',
    width: 340,
    height: 50,
    borderWidth: 3,
    borderColor: "#573C35",
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    marginBottom: 100,
    marginTop: 10,
  },
  telefoneText: {
    fontFamily: 'Roboto_900Black',
    fontSize: wp('5%'),
    color: '#000000',
    padding: 10,
    textAlign: 'center',
  },

  // Ao clicar nas imagens
  modalContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  },
  fullScreenImage:{
    width: 350,
    height: 350,
    resizeMode: 'contain',
  },
  closeButtonIcon:{
    left: 150,
  }

});