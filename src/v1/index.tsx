import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';

import Navigation from './modules';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NativeBaseProvider} from 'native-base';
import {myTheme} from './utils/theme';
import { AuthContext, AuthProvider } from "./providers/AuthProvider";

const App = () => {

  return (
    <AuthProvider>
      <AuthContext.Consumer>
        {(auth) => (
          <NavigationContainer>
            <NativeBaseProvider theme={myTheme}>
                    <SafeAreaProvider>
                      <Navigation />
                    </SafeAreaProvider>
            </NativeBaseProvider>
          </NavigationContainer>
        )}
        </AuthContext.Consumer>
    </AuthProvider>
  );

}


export default App;
