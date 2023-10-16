// Importando o React
import React, { useState } from 'react';

// Importando o splash
import { Splash } from './src/screens/Splash/';

// Importando as Rotas
import Rotas from './src/rotas';

function App() {
    const [splashComplete, setSplashComplete] = useState(false); // Estado para a Splash Screen

    // Retorna as rotas depois que o vídeo da splash screen terminar
    return (
        
        splashComplete
            ? <Rotas/>
            : <Splash onComplete={setSplashComplete} />
    );
    
}

export default App;