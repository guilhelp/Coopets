import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import styles from './styles';

export default function ChatOptionsMenu({ onDesfazerMatchPress, isVisible, onClose }) {
  return (
    // Componente Modal que exibe opções de menu para um chat
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContainer}>
        {/* Opção para desfazer um "match" (Petch) */}
        <TouchableOpacity onPress={onDesfazerMatchPress} style={styles.optionItem}>
          <Text style={styles.optionText}>Desfazer Petch</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
