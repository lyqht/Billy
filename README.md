# Billy <!-- omit in toc -->

[![Update database types](https://github.com/lyqht/Billy/actions/workflows/update-types.yml/badge.svg)](https://github.com/lyqht/Billy/actions/workflows/update-types.yml)


<div style="display: grid; place-items:center;">
    <img width="300" src="./demo/overview_v0.0.1.gif"></img>
</div>

<br />

Table of contents

- [Brief introduction](#brief-introduction)
- [Tech Notes](#tech-notes)
  - [Building blocks of this project](#building-blocks-of-this-project)
  - [Misc Tech Notes](#misc-tech-notes)
- [Set up instructions](#set-up-instructions)
  - [Install dependencies](#install-dependencies)
  - [Detox](#detox)
  - [Clearing cache](#clearing-cache)
- [Motivations for building the app](#motivations-for-building-the-app)

## Brief introduction

This project is developed solely by [Estee Tey](https://www.github.com/lyqht). If you are keen on how the app idea came about, you can refer to the [motivations section](#motivations-for-building-the-app).

- Live progress on this project can be found in [this #BuildInPublic tweet thread](https://twitter.com/estee_tey/status/1511017683440996359).  
- For more in-depth details on planned & implemented features, you could refer to [ROADMAP.md](./ROADMAP.md).

## Tech Notes

### Building blocks of this project

- [UI Kittens](https://github.com/akveo/react-native-ui-kitten) for UI components
- [Supabase](https://github.com/supabase/supabase) for Database & Auth. Data is served by REST.
- [React Native MMKV](https://github.com/mrousavy/react-native-mmkv) for caching
- [Notifee](https://github.com/invertase/notifee) for creating notifications
- [Custom GitHub action for generating Supabase database types](https://blog.esteetey.dev/how-to-create-and-test-a-github-action-that-generates-types-from-supabase-database)
### Misc Tech Notes

If you are interested on some other tech notes how this app is built (e.g. how the app is bootstrapped, mockup etc), check out the [tech notes](./TECH_NOTES.md).

## Set up instructions

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

### Clearing cache

There is a utility function on `SyncService` for logging the user out, clearing all cache and notifications. Intended mostly for testing purposes. 

```ts
const init = async () => {
  // add this line for clearing cache temporarily
  await SyncService.clearAllData();

  await SyncService.syncAllData();
  await registerDeviceForRemoteMessages();
};

```

---

## Motivations for building the app

I had built Billy intended for these few specific target audiences:
- Less tech-savvy users like my mom, who are **only-mobile users**, and prefer having **specific apps for specific functionalities**. They would benefit heavily from native notifications to keep track of their bills.
- Techies like me who are less organized, but has a ton of subscriptions to remember to manage and pay on time. Many times, I also **don't want to automatically renew these subscriptions** if I don't use them much during the trial period. 

My mom & I both like cute stuff, so that's how _Billy_ has its name.



<div style="display: grid; place-items:center;">
    <img width="350" src="./demo/concerned_billy.png"></img>
</div>

<br />

