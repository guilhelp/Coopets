import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 200,
    marginTop: 30,
  },
  background: {
    width: wp('100%'),
    height: hp('110%'),
  },

  // Configurando o container dos botões superiores
  buttonContainer: {
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
  denunciarButton: {
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

  // Configurando a imagem de perfil
  imagemPerfil: {
    width: 290,
    height: 290,
    borderWidth: 5,
    borderColor: "#573C35",
    borderRadius: 2000,
    backgroundColor: "#573C35",
    zIndex: 1,
  },

  // Configurando o nome de perfil
  nomePerfil: {
    fontFamily: 'Roboto_900Black',
    fontSize: wp('11%'),
    marginTop: 10,
    marginBottom: 30,
    color: '#000000'
  },



  // Configurando a biografia
  descricaoPerfil: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 336,
    height: 87,
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
  },
  getTextBio: {
    fontFamily: 'Roboto_900Black',
    fontSize: wp('5%'),
    color: '#000000',
    padding: 10,
    textAlign: 'center'
  },
  titleViewBio: {
    fontFamily: 'Roboto_900Black',
    fontSize: wp('6%'),
    color: '#000000',
    padding: 10,
  },


  // Configuranod as informações do pet
  titleView: {
    fontFamily: 'Roboto_900Black',
    fontSize: wp('6%'),
    color: '#000000',
    marginHorizontal: 30,
  },
  getText: {
    fontFamily: 'Roboto_900Black',
    fontSize: wp('5%'),
    color: '#000000',
  },
  sexoContainer: {
    marginTop: 20,
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
  viewSexo: {
    width: 150,
    height: 70,
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 17,
    marginBottom: 10,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewIdade: {
    width: 150,
    height: 70,
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 17,
    marginBottom: 10,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  getSexo: {
    fontFamily: 'Roboto_900Black',
    fontSize: 30,
    color: '#000000',
  },
  getIdade: {
    fontFamily: 'Roboto_900Black',
    fontSize: 30,
    color: '#000000',
  },


  // Configurando a localização
  tituloText: {
    fontSize: wp('7%'),
    color: '#000000',
    fontFamily: 'Roboto_900Black',
    margin: 10,
  },
  localizacaoPerfil: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 310,
    height: 100,
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    padding: 10,
  },
  getTextLocal: {
    fontFamily: 'Roboto_900Black',
    fontSize: wp('5%'),
    color: '#000000',
  },

  // Configurando o botão de documentos
  buttonDocs: {
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

