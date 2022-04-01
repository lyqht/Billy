# Tech Notes

## How this project is created

This project is bootstrapped by 
```
npx react-native init Billy --template @ui-kitten/template-ts
```

## Building blocks of this project

- UI Kittens for UI components
- Supabase for Database & User Management
- Notifee for creating & editing notifications

### Random stuff learnt along the way

- UI Kittens do not come with FABs
- Supabase requires `react-native-url-polyfill` on React Native to work ([Reference](https://justinnoel.dev/2020/12/08/react-native-urlsearchparams-error-not-implemented/))