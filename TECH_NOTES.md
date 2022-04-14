# Misc Tech Notes <!-- omit in toc -->

- [How this project is created](#how-this-project-is-created)
- [Initial Mock up](#initial-mock-up)
- [Random stuff learnt along the way](#random-stuff-learnt-along-the-way)

## How this project is created

This project is bootstrapped by 
```
npx react-native init Billy --template @ui-kitten/template-ts
```

Many things have been heavily modified since then!

## Initial Mock up

![](demo/initial_mockup.png)

Yes it looks a lot different from then! The original figma mockup is made using Native Base's Figma kit — and now I'm not even using Native Base component library. This mockup gave me sufficient ideas on what I want to display that I didn't feel a need to create a new one.

## Random stuff learnt along the way

- UI Kittens does not come with FABs, so had to change design
- Supabase requires `react-native-url-polyfill` on React Native to work ([Reference](https://justinnoel.dev/2020/12/08/react-native-urlsearchparams-error-not-implemented/))
- If creating DB on Supabase that is imported from spreadsheet, the autoincrement index needs to be manually reset. ([Reference](https://github.com/supabase/supabase/issues/1804))
- For using custom storage provider with Supabase on React Native, we have to declare an interface that resembles Async Storage ([Reference](https://github.com/supabase/supabase/issues/6348))
- Integrating UI Kittens Select component with React Hook Form ([Reference](https://github.com/react-hook-form/react-hook-form/discussions/8187))