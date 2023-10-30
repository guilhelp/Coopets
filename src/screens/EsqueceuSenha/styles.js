import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: wp('100%'),
    height: hp('110%'),
  },

  // Configurando o texto
  textoContainer: {
    backgroundColor: '#573C35',
    borderRadius: 17,
    width: 305,
    height: 146,
    justifyContent: 'center',
    borderColor: "#EEE1D3",
    borderWidth: 5,
    margin: 50,
  },
  textInfo: {
    fontFamily: 'Roboto_900Black',
    fontSize: wp('6%'),
    color: '#FFFFFF',
    textAlign: 'center'
  },

  // Configurando o container de inputs
  inputContainer: {
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',

  },

  // Configurando os botões
  button: {
    backgroundColor: '#573C35',
    borderRadius: 17,
    width: 300,
    height: 67,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderColor: '#EEE1D3',
        borderWidth: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Roboto_900Black',
    fontSize: 22,
  },



});
