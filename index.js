import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import utc from 'dayjs/plugin/utc';
import {AppRegistry} from 'react-native';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto'; // necessary for supabase in react native
import {name as appName} from './app.json';
import App from './src/App';
dayjs.extend(utc);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

AppRegistry.registerComponent(appName, () => App);
