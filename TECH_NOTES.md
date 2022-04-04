# Tech Notes

## How this project is created

This project is bootstrapped by 
```
npx react-native init Billy --template @ui-kitten/template-ts
```

## Building blocks of this project

- [UI Kittens](https://github.com/akveo/react-native-ui-kitten) for UI components
- [Supabase](https://github.com/supabase/supabase) for Database & User Management
- [Notifee](https://github.com/invertase/notifee) for creating & editing notifications
- [React Native MMKV](https://github.com/mrousavy/react-native-mmkv) for caching

### Random stuff learnt along the way

- UI Kittens does not come with FABs, so had to change design
- Supabase requires `react-native-url-polyfill` on React Native to work ([Reference](https://justinnoel.dev/2020/12/08/react-native-urlsearchparams-error-not-implemented/))
- If creating DB on Supabase that is imported from spreadsheet, the autoincrement index needs to be manually reset. ([Reference](https://github.com/supabase/supabase/issues/1804))