import { useState } from "react";
import { StyleSheet } from "react-native";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import { hideAsync } from 'expo-splash-screen';

export function Splash({ onComplete }) {
    const [lastStatus, setStatus] = useState({});

    function onPlayBackStatusUpdate(status) {
        if (status.isLoaded) {
            if (lastStatus.isLoaded !== status.isLoaded) {
                hideAsync();
            }
            if (status.didJustFinish) {
                onComplete(true);
            }
        }
        setStatus(status);
    }

    return (
        <Video
            style={StyleSheet.absoluteFill}
            resizeMode={ResizeMode.COVER}
            source={require('../../../assets/splash.mp4')}
            isLooping={false}
            onPlaybackStatusUpdate={onPlayBackStatusUpdate}
            shouldPlay={true}
        />
    );
}
