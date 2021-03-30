import React from 'react';
import { View, StatusBar } from 'react-native';
import Board from './components/Board';
import { LinearGradient } from 'expo-linear-gradient';
import { primaryGradientArray } from './utils/Colors';

const App = () => (
    <LinearGradient colors={primaryGradientArray}
                    style={{ height: 1100 }}
    >
        <View>
            <StatusBar barStyle="dark-content" hidden={false} />
            <Board />
        </View>
    </LinearGradient>
);

export default App;
