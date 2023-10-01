import React, { useState, useEffect } from 'react';
import { Splash } from './src/screens/Splash/';
import Rotas from './src/rotas';

function App() {
    const [splashComplete, setSplashComplete] = useState(false);

    return (
        splashComplete
            ? <Rotas/>
            : <Splash onComplete={setSplashComplete} />
    );
}

export default App;