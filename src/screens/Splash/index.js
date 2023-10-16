import { useState } from "react";
import { StyleSheet } from "react-native";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import { hideAsync } from 'expo-splash-screen';

export function Splash({ onComplete }) {
    const [lastStatus, setStatus] = useState({});

    // Função chamada quando o status de reprodução do vídeo é atualizado
    function onPlayBackStatusUpdate(status) {
        if (status.isLoaded) {
            // Verifica se o vídeo está carregado
            if (lastStatus.isLoaded !== status.isLoaded) {
                hideAsync(); // Esconde a tela de splash (se ainda não estiver escondida)
            }
            if (status.didJustFinish) {
                onComplete(true); // Se o vídeo acabou de ser reproduzido, chama a função `onComplete`
            }
        }
        setStatus(status); // Atualiza o estado com o novo status de reprodução
    }

    return (
        <Video
            style={StyleSheet.absoluteFill} // Define o estilo do vídeo para ocupar toda a tela
            resizeMode={ResizeMode.COVER} // Define o modo de redimensionamento do vídeo
            source={require('../../../assets/splash.mp4')} // Define a fonte do vídeo (um arquivo no projeto)
            isLooping={false} // Define se o vídeo deve ser reproduzido em loop (no caso, não)
            onPlaybackStatusUpdate={onPlayBackStatusUpdate} // Define a função a ser chamada quando o status de reprodução é atualizado
            shouldPlay={true} // Define se o vídeo deve começar a ser reproduzido imediatamente
        />
    );
}
