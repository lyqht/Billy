import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  Button,
  Divider,
  Layout,
  Tab,
  TabBar,
  Text,
} from '@ui-kitten/components';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {CustomInput} from '../components/Input/CustomInput';
import {NavigationProps, RootStackParamList} from '../routes';
import SyncService from '../services/SyncService';
import UserService from '../services/UserService';
import {LoginMode} from '../types/LoginMode';
import BillyHero from '../../assets/BillyHero.png';

const LOGGER_PREFIX = '[Login]';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

interface FormData {
  email: string;
  password: string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({route}) => {
  const navigation = useNavigation<NavigationProps>();
  const {loginMode} = route.params;
  const [selectedLoginMode, setSelectedLoginMode] = useState(loginMode);
  const [selectedIndex, setSelectedIndex] = useState(
    loginMode === LoginMode.SIGN_UP ? 0 : 1,
  );
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async () => {
    const {email, password} = getValues();
    setLoading(true);

    try {
      switch (selectedLoginMode) {
        case LoginMode.SIGN_UP:
          await UserService.signUpUser(email, password);
          break;
        case LoginMode.SIGN_IN:
          await UserService.signInUser(email, password);
          break;
      }
    } catch (err) {
      console.error(`${LOGGER_PREFIX} ${JSON.stringify(err)}`);
      setErrorText(`${err}, please try again later.`);
    }

    await SyncService.syncAllData();
    navigation.navigate('Home');
    setLoading(false);
  };

  const getButtonText = () =>
    selectedLoginMode === LoginMode.SIGN_IN ? 'Log in' : 'Sign up';
  const getGreetingText = () =>
    selectedLoginMode === LoginMode.SIGN_IN ? 'Welcome back!' : 'You new here?';
  const getDescriptionText = () =>
    selectedLoginMode === LoginMode.SIGN_IN
      ? 'Need a reminder on what Billy does for you? Here are some features that Billy offers ➜'
      : 'Billy is happy to help you track your expenses! Here are some features that Billy offers ➜';

  return (
    <ScrollView>
      <Layout style={styles.container}>
        <View>
          <TabBar
            selectedIndex={selectedIndex}
            onSelect={index => {
              setSelectedIndex(index);
              setSelectedLoginMode(
                index === 0 ? LoginMode.SIGN_UP : LoginMode.SIGN_IN,
              );
            }}
          >
            <Tab title="Register an account" />
            <Tab title="Sign in" />
          </TabBar>
        </View>
        <View style={styles.bottomContainer}>
          <Image
            style={styles.image}
            source={BillyHero}
            accessibilityLabel={'An image of Billy giving you a concerned look'}
          />
          <Text category={'h4'}>{getGreetingText()}</Text>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL('https://github.com/lyqht/Billy');
            }}
          >
            <Text style={styles.formFieldContainer} category={'p1'}>
              {getDescriptionText()}
            </Text>
          </TouchableOpacity>
          <Divider style={styles.formFieldContainer} />
          <View style={styles.formFieldContainer}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, value, name}}) => (
                <CustomInput
                  label={name}
                  value={value}
                  onChangeText={onChange}
                  placeholder="billy@gmail.com"
                  icon="person"
                />
              )}
            />
            {errors.email && (
              <Text status={'warning'} category={'label'}>
                This field is required
              </Text>
            )}
          </View>
          <View style={styles.formFieldContainer}>
            <Controller
              name="password"
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, value, name}}) => (
                <CustomInput
                  label={name}
                  value={value}
                  onChangeText={onChange}
                  placeholder="at least 6 characters"
                  inputSecure={true}
                />
              )}
            />
          </View>
          <Button
            size="medium"
            disabled={loading}
            onPress={handleSubmit(onSubmit)}
          >
            {loading ? (
              <ActivityIndicator color={'#5C940D'} />
            ) : (
              getButtonText()
            )}
          </Button>
          <Text style={styles.errorText} status={'danger'}>
            {errorText}
          </Text>
        </View>
      </Layout>
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  image: {
    marginVertical: 24,
    width: 200,
    height: 200,
  },
  formFieldContainer: {
    marginVertical: 16,
  },
  bottomContainer: {
    margin: 16,
    paddingBottom: 16,
  },
  errorText: {
    marginVertical: 16,
    textAlign: 'center',
  },
});
