import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    popupContainer: {
        flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    popupContent: {
      backgroundColor: '#573C35',
      width: '90%',
      height: '50%',
      borderRadius: 10,
      alignItems: 'center',
      borderColor: '#FFF',
      borderWidth: 5,
      padding: 20,
    },
    tituloText:{
        fontFamily: 'LuckiestGuy_400Regular',
        fontSize: 40,
        color: '#FFF'
    },
    popupText: {
        fontFamily: 'Roboto_900Black',
        fontSize: 15,
        color: '#FFF'
    },
    verMaisContainer:{
        justifyContent: 'flex-end',
        left: 130,
        marginTop: 10,
    },
    showMoreButtonText:{
        fontFamily: 'Roboto_900Black',
        fontSize: 15,
        color: '#FFF'
    },
    popupButton: {
      backgroundColor: '#FFF',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
    },
    popupButtonText: {
      color: '#000000',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  