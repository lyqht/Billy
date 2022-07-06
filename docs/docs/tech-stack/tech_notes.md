# Project Setup

This project is bootstrapped by 
```
npx react-native init Billy --template @ui-kitten/template-ts
```

Many things have been heavily modified since then!

## Tech Architecture

![](/img/diagrams/service_architecture.png)

## Random stuff learnt along the way about dependencies used in the project

- UI Kittens does not come with FABs, so had to change design
- Supabase requires `react-native-url-polyfill` on React Native to work ([Reference](https://justinnoel.dev/2020/12/08/react-native-urlsearchparams-error-not-implemented/))
- If creating DB on Supabase that is imported from spreadsheet, the autoincrement index needs to be manually reset. ([Reference](https://github.com/supabase/supabase/issues/1804)). 
  - For example, to get the serial sequence and alter it with the new index, you can use an example script below

  ```
  SELECT PG_GET_SERIAL_SEQUENCE('"Bill"', 'id')
  ALTER SEQUENCE public.bills_id_seq RESTART WITH 217
  ```

- For using custom storage provider with Supabase on React Native, we have to declare an interface that resembles Async Storage ([Reference](https://github.com/supabase/supabase/issues/6348))
- Integrating UI Kittens Select component with React Hook Form ([Reference](https://github.com/react-hook-form/react-hook-form/discussions/8187))
- Detox
  - Should create builds in release for E2E rather than in debug mode for detox ([Reference](https://github.com/wix/Detox/issues/1382))