import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  background: {
    width: wp('100%'),
    height: hp('100%'),
  },
  buttonContainer:{
    flexDirection: 'row'
  },
  returnButton: {
    width: 60,
    height: 60,
    borderRadius: 200,
    backgroundColor: '#573C35',
    marginLeft: -190,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
    },
  denunciarButton:{
    width: 60,
    height: 60,
    borderRadius: 200,
    backgroundColor: '#573C35',
    marginRight: -100,
    left: 125,
    marginTop: 20,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  
  imagemPerfil: {
    width: wp('65%'),
    height: hp('33%'),
    borderWidth: 5,
    borderColor: "#573C35",
    borderRadius: 2000,
    backgroundColor: "#573C35",
    zIndex: 1,
  },
  nomePerfil: {
    fontFamily: 'Roboto_900Black',
    fontSize: wp('11%'),
    marginTop: 10,
    marginBottom: 30,
    color: '#000000'
  },

  getTextBio: {
    fontFamily: 'Roboto_900Black',
    fontSize: wp('5%'),
    color: '#000000',
    padding: 10,
    textAlign: 'center'
  },

  // Informações do Pet
  descricaoPerfil: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 340,
    height: 120,
    borderWidth: 3,
    borderColor: "#573C35",
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
  },
  titleView: {
    fontFamily: 'Roboto_900Black',
    fontSize: wp('7%'),
    color: '#000000',
  },
  viewSexo: {
    width: 186,
    height: 76,
    borderWidth: 3,
    borderColor: '#573C35',
    borderRadius: 30,
    marginBottom: 10,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewIdade: {
    width: 186,
    height: 76,
    borderWidth: 3,
    borderColor: '#573C35',
    borderRadius: 30,
    marginBottom: 10,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  getText: {
    fontFamily: 'Roboto_900Black',
    fontSize: wp('5%'),
    color: '#000000',
  },
  sexoContainer: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  idadeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tipoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  racaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Localizacao
  tituloText: {
    fontSize: wp('7%'),
    color: '#000000',
    fontFamily: 'Roboto_900Black',
    margin: 10,
  },
  localizacaoPerfil: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 350,
    height: 111,
    borderWidth: 3,
    borderColor: "#573C35",
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    padding: 10,
  },
  getTextLocal:{
    fontFamily: 'Roboto_900Black',
    fontSize: wp('5%'),
    color: '#000000',
  },

  // Botão de Documentos
  buttonDocs:{
    alignItems: 'center',
    justifyContent: 'center',
    width: 350,
    height: 90,
    borderRadius: 30,
    marginBottom: 20,
    marginTop: 0,
    backgroundColor: "#573C35",
    color: '#FFFFFF'
  },
  buttonScreensContainer: {
    paddingTop: 50,
  },
  buttonText: {
    fontFamily: 'Roboto_900Black',
    fontSize: wp('8%'),
    color: '#FFFFFF',
  },
  
  
});

export default styles