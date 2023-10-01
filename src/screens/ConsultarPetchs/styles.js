import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(116, 81, 70, 0.5)',
    borderColor: '#EEE1D3',
    borderWidth: 5,
    borderRadius: 20,
    marginTop: 10,
  },
  background: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    marginTop: 30,
  },
  chatItemContent: {
    backgroundColor: '#D1B2A7',
    flexDirection: 'row',
    alignItems: 'center',
    width: 350,
    marginTop: 15,
    borderRadius: 30,
    borderColor: '#EEE1D3',
    borderWidth: 5,
  },
  chatItemImage:{
    width: 80,
    height: 80,
    borderRadius: 200,
    margin: 10,
  },
  chatDetailsContent:{
    
  },
  chatItemName:{
    fontFamily: 'Roboto_900Black',
    fontSize: 22,
    color: '#000000',
    marginBottom: 1,
  },
  chatItemLastMessage:{
    fontFamily: 'Roboto_900Black',
    fontSize: 15,
    color: '#FFFFFF',
    marginBottom: 1,
  },
  lastMessageText:{
    fontSize: 100,
  },
  chatLastMessage:{
    fontSize: 15,
  },


});