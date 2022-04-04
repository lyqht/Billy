import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Layout, Text} from '@ui-kitten/components';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
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
    switch (loginMode) {
      case LoginMode.SIGN_UP:
        await UserService.signUpUser(email, password);
        break;
      case LoginMode.SIGN_IN:
        await UserService.signInUser(email, password);
        break;
    }

    navigation.navigate('Home');
  };

  const getTitle = () =>
    loginMode === LoginMode.SIGN_IN ? 'Sign in' : 'Register an account';
  const getButtonText = () =>
    loginMode === LoginMode.SIGN_IN ? 'Log in' : 'Sign up';

  return (
    <SafeAreaView>
      <Layout style={styles.container}>
        <View>
          <Text category="h2">{getTitle()}</Text>
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
                  icon="eye-off"
                />
              )}
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button size="medium" onPress={handleSubmit(onSubmit)}>
            {getButtonText()}
          </Button>
        </View>
      </Layout>
    </SafeAreaView>
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
});
