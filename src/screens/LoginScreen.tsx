import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Layout, Tab, TabBar, Text} from '@ui-kitten/components';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {StyleSheet, View} from 'react-native';
import {CustomInput} from '../components/BillForm/CustomInput';
import {NavigationProps, RootStackParamList} from '../routes';
import UserService from '../services/UserService';
import {LoginMode} from '../types/LoginMode';

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
    try {
      switch (loginMode) {
        case LoginMode.SIGN_UP:
          await UserService.signUpUser(email, password);
          break;
        case LoginMode.SIGN_IN:
          await UserService.signInUser(email, password);
          break;
      }
      navigation.navigate('Home');
    } catch (err) {
      setErrorText(`${err}, please try again later.`);
    }
  };

  const getButtonText = () =>
    selectedLoginMode === LoginMode.SIGN_IN ? 'Log in' : 'Sign up';

  return (
    <View>
      <Layout style={styles.container}>
        <View>
          <TabBar
            selectedIndex={selectedIndex}
            onSelect={index => {
              setSelectedIndex(index);
              setSelectedLoginMode(
                index === 0 ? LoginMode.SIGN_UP : LoginMode.SIGN_IN,
              );
            }}>
            <Tab title="Register an account" />
            <Tab title="Sign in" />
          </TabBar>
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
                  placeholder="tecktan@gmail.com"
                  icon="person"
                />
              )}
            />
            {errors.email && (
              <Text category={'label'}>This field is required</Text>
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
        </View>
        <View style={styles.buttonContainer}>
          <Text style={styles.errorText} status={'danger'}>
            {errorText}
          </Text>
          <Button size="medium" onPress={handleSubmit(onSubmit)}>
            {getButtonText()}
          </Button>
        </View>
      </Layout>
    </View>
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
  formFieldContainer: {
    margin: 16,
  },
  buttonContainer: {
    marginVertical: 16,
  },
  errorText: {
    marginVertical: 16,
    textAlign: 'center',
  },
});
