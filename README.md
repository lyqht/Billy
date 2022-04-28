# Billy <!-- omit in toc -->
<div style="display: grid; place-items:center;">
  <img width="200" src="./assets/BillyHero.png"></img>
  
  [![Update database types](https://github.com/lyqht/Billy/actions/workflows/update-types.yml/badge.svg)](https://github.com/lyqht/Billy/actions/workflows/update-types.yml)

  <span>
    <a href="#introduction-">Introduction 🌱</a>
    •
    <a href="#tech-notes-">Tech Notes 🗒</a>
    •
    <a href="#setup-instructions-">Setup instructions ⚙️</a>
    •
    <a href="./CONTRIBUTING.md">Contributing </a>
  </span>
</div>


## Introduction 🌱

Billy is your mobile companion app to help you manage your upcoming bills and remind you when they're due. Say goodbye to late payment fees!

<div style="display: grid; place-items:center;">
    <img width="300" src="./demo/overview_v0.0.1.gif"></img>
</div>

<br />

For now, this project is developed solely by [Estee Tey](https://www.github.com/lyqht). 

- If you are keen on how the app idea came about, you can refer to the [motivations section](./docs/motivations.md).
- Live progress on this project can be found in [this #BuildInPublic tweet thread](https://twitter.com/estee_tey/status/1511017683440996359).  
- For more in-depth details on planned & implemented features, you could refer to [ROADMAP.md](./docs/roadmap.md).

## Tech Notes 🗒

### Building blocks of this project 🧱

- [UI Kittens](https://github.com/akveo/react-native-ui-kitten) for UI components
- [Supabase](https://github.com/supabase/supabase) for Database & Auth. Data is served by REST.
- [React Native MMKV](https://github.com/mrousavy/react-native-mmkv) for caching
- [Notifee](https://github.com/invertase/notifee) for creating notifications
- [Custom GitHub action for generating Supabase database types](https://blog.esteetey.dev/how-to-create-and-test-a-github-action-that-generates-types-from-supabase-database)
### Misc Tech Notes

If you are interested on some other tech notes how this app is built (e.g. how the app is bootstrapped, mockup etc), check out the [tech notes](./docs/TECH_NOTES.md).

## Set up instructions ⚙️

### Install dependencies

Install the node modules & pods 

```
npm i
npx pod-install # if you want to build for ios
```

Then run 1 of the commands 
```
npm run ios
npm run android
```

You would need the Supabase project related environment variables as mentioned in `.env.sample`. You can create your own Supabase project and replace those values.

### Detox
You need node 16.13.0 for detox that depends on jest-circus runner.