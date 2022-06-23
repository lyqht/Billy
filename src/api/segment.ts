import {SEGMENT_WRITE_KEY} from '@env';
import {createClient} from '@segment/analytics-react-native';
import {FirebasePlugin} from '@segment/analytics-react-native-plugin-firebase';

const segmentClient = createClient({
  writeKey: SEGMENT_WRITE_KEY || '',
  collectDeviceId: true,
  trackAppLifecycleEvents: true,
  trackDeepLinks: true,
});

segmentClient.add({plugin: new FirebasePlugin()});

export default segmentClient;
