import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
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

  // Imagem de perfil

  imagemPerfil: {
    width: 290,
    height: 290,
    borderWidth: 4,
    borderColor: "#573C35",
    borderRadius: 2000,
    backgroundColor: "#573C35",
    zIndex: 1,
  },
  buttonEditarContainer: {
    width: 50,
    height: 50,
    position: 'absolute',
    zIndex: 2,
    left: 200,
    bottom: 10,
    backgroundColor: "#573C35",
    borderRadius: 2000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editarButton: {
    width: 50,
    height: 50,
  },
  nomePerfil: {
    fontFamily: 'Roboto_900Black',
    fontSize: wp('11%'),
    marginTop: 10,
    marginBottom: 30,
    color: '#000000'
  },
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

  // Bio
  titleViewBio: {
    fontFamily: 'Roboto_900Black',
    fontSize: wp('6%'),
    color: '#000000',
    padding: 10,
    
  },
  descricaoPerfil: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 336,
    height: 87,
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    marginBottom: 30,
  },
  getTextBio:{
    fontFamily: 'Roboto_900Black',
    fontSize: wp('5%'),
    color: '#000000',
    padding: 10,
    textAlign: 'center'
  },

  // Informações do pet
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

  // Localização
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
  getTextLocal:{
    fontFamily: 'Roboto_900Black',
    fontSize: wp('5%'),
    color: '#000000',
  },


  // Botão de Documentos
  buttonDocs:{
    alignItems: 'center',
    justifyContent: 'center',
    width: 331,
    height: 79,
    borderRadius: 17,
    marginBottom: 10,
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

  // Container dos botões finais
  botoesFinalContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
  },

  // Botão de Excluir
  buttonExcluirContainer:{
    paddingTop: 10,
  },

  buttonExcluir:{
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 50,
    borderRadius: 17,
    marginBottom: 20,
    marginTop: 0,
    backgroundColor: "#573C35",
    color: '#FFFFFF'
  },
  buttonTextExcluir:{
    fontFamily: 'Roboto_900Black',
    fontSize: wp('4%'),
    color: '#FFFFFF',
  },
  // Botão de Sair
  buttonSairContainer:{
    paddingTop: 10,
    marginLeft: 50,
  },
  buttonSair:{
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 50,
    borderRadius: 17,
    marginBottom: 20,
    marginTop: 0,
    backgroundColor: "#573C35",
    color: '#FFFFFF'
  },
  buttonTextSair:{
    fontFamily: 'Roboto_900Black',
    fontSize: wp('5%'),
    color: '#FFFFFF',
  },

  
    // Tela de carregamento
    imagemLogo:{
      width: wp('60%'),
      height: hp('30%'),
  },
  carregando:{
      color: '#FFFFFF',
      fontSize: 30,
      fontFamily: 'Roboto_900Black',
      marginBottom: 10,
  },
  loadingOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      zIndex: 4,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },


});

export default styles