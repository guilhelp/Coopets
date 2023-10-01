import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
export default StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: wp('100%'),
    height: hp('110%'),
  },
  inputContainer: {
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
   
  },
  inputText: {
    fontFamily: 'Roboto_900Black',
    fontSize: wp('10%'),
    color: '#FFF'
  },
  input: {
      width: 300,
      height: 72,
      borderWidth: 3,
      borderColor: '#000000',
      borderRadius: 17,
      marginBottom: 10,
      paddingHorizontal: 10,
      fontSize: 20,
      backgroundColor: '#FFF'
  },
  button: {
    backgroundColor: '#573C35',
    borderRadius: 17,
    width: 300,
    height: 67,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Roboto_900Black',
    fontSize: 18,
  },
  textInfo: {
    fontFamily: 'Roboto_900Black',
    fontSize: wp('6%'),
    color: '#FFFFFF',
    textAlign: 'center'
  },
  textoContainer:{
    backgroundColor: '#573C35',
    borderRadius: 30,
    width: 305,
    height: 146,
    justifyContent: 'center',
    borderColor: "#EEE1D3",
    borderWidth: 5,
    margin: 50,
    
    
    
  }
});
