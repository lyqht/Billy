import 'react-native-url-polyfill/auto'; // necessary for supabase in react native
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
