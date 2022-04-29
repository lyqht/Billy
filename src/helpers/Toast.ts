import Toast, {ToastShowParams} from 'react-native-toast-message';

export const showToast = (toastParams: ToastShowParams) => {
  Toast.show({
    ...toastParams,
    position: 'bottom',
    bottomOffset: 120,
  });
};
