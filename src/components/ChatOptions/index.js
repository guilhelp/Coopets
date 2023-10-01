import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

export default function ChatOptionsMenu({ onDesfazerMatchPress, isVisible, onClose }) {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity onPress={onDesfazerMatchPress} style={styles.optionItem}>
          <Text style={styles.optionText}>Desfazer Petch</Text>
        </TouchableOpacity>
        {/* Adicione outras opções aqui, se necessário */}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#573C35',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    height: '50%',
    marginTop: 500,
    borderColor: '#FFF',
    borderWidth: 3,
  },
  optionItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
});