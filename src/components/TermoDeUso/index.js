import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { styles } from './styles';

const TermosDeUsoPopup = ({ visible, onAccept }) => {
    const [showFullText, setShowFullText] = useState(false);

    // Texto completo dos termos de uso
    const fullText = `
  Bem-vindo ao Coopets! O Coopets é um aplicativo dedicado a conectar amantes de animais de estimação, facilitando o cuidado e a interação entre donos de pets. Antes de utilizar o nosso aplicativo, pedimos que você leia e compreenda os seguintes termos de uso.

  1. Coleta de Dados Pessoais
  
  Para fornecer os serviços do Coopets, precisamos coletar e armazenar informações pessoais limitadas sobre você e seus pets. Essas informações podem incluir seu nome, endereço de e-mail, documentos como pedigree e carteira de vacinação do seu pet e imagens de perfil do pet. Os dados pessoais coletados serão tratados de acordo com nossa Política de Privacidade.
  
  2. Uso das Informações
  
  Utilizamos suas informações pessoais para:
  
  Criar e gerenciar sua conta no Coopets.
  Conectar você a outros membros da comunidade Coopets para compartilhar informações sobre pets e cuidados.
  Personalizar sua experiência no aplicativo, incluindo recomendações de conteúdo com base em suas preferências.
  Facilitar a comunicação entre membros.
  Cumprir nossas obrigações legais e regulamentares.

  3. Compartilhamento de Informações
  
  Seus dados pessoais não serão vendidos a terceiros. No entanto, podemos compartilhar informações com:
  
  Outros membros do Coopets, como parte das funcionalidades do aplicativo.
  Parceiros de negócios para melhorar nossos serviços e oferecer recursos adicionais.
  Autoridades governamentais, quando exigido por lei.

  4. Segurança dos Dados
  
  Empregamos medidas de segurança adequadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição não autorizada. No entanto, lembre-se de que nenhum sistema é completamente seguro, e você também é responsável por proteger suas credenciais de login.
  
  5. Consentimento
  
  Ao usar o Coopets, você consente com a coleta, uso e compartilhamento de suas informações pessoais de acordo com estes termos de uso e nossa Política de Privacidade.
  
  6. Encerramento da Conta
  
  Você pode encerrar sua conta no Coopets a qualquer momento, entrando em contato conosco através dos canais de suporte disponíveis ou excluindo sua conta na aba de perfil.
  
  7. Alterações nos Termos de Uso
  
  Reservamos o direito de fazer alterações nestes termos de uso periodicamente. Informaremos você sobre quaisquer alterações significativas.
  
  8. Contato
  
  Se você tiver alguma dúvida ou preocupação sobre estes termos de uso ou nossa política de privacidade, entre em contato conosco em coopetsapp@gmail.com
  
  Agradecemos por escolher o Coopets e por se juntar à nossa comunidade de amantes de pets! Juntos, tornaremos a experiência de cuidar de animais de estimação ainda mais gratificante.
  
  Data de entrada em vigor: 01/10/2023
  `;

    const trimmedText = showFullText ? fullText : fullText.slice(0, 1000); // Mostra apenas os primeiros 200 caracteres

    return (
        <Modal transparent animationType="slide" visible={visible}>
            <View style={styles.popupContainer}>
                <View style={styles.popupContent}>
                    <Text style={styles.tituloText}> TERMO DE USO </Text>
                    <ScrollView style={styles.scrollView}>
                        <Text style={styles.popupText}>{trimmedText}</Text>
                    </ScrollView>
                    {!showFullText && (
                        <View style={styles.verMaisContainer}>
                            <TouchableOpacity onPress={() => setShowFullText(true)} style={styles.showMoreButton}>
                                <Text style={styles.showMoreButtonText}>Ver Mais</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    <TouchableOpacity onPress={onAccept} style={styles.popupButton}>
                        <Text style={styles.popupButtonText}>Aceitar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default TermosDeUsoPopup;
