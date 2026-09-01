import React, { createContext, useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
} from 'react-native';
import Exstyles from './Components/Styles';
import AllPages from './Components/AllPages';

export const RenderItems = createContext();

const App = () => {
  const [themeValue, setThemeValue] = useState(true);

  return (
    <View style={{flex: 1 ,}}>
      <RenderItems.Provider
        value={{
          themeValue,
          setThemeValue,
        }}
      >
        <AllPages />
      </RenderItems.Provider>
    </View>
  );
};

export default App;
