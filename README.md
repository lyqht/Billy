# Billy

[![Update database types](https://github.com/lyqht/Billy/actions/workflows/update-types.yml/badge.svg)](https://github.com/lyqht/Billy/actions/workflows/update-types.yml)


<div style="display: grid; place-items:center;">
    <img width="300" src="./demo/overview_v0.0.1.gif"></img>
</div>

<br />

## Brief introduction

This project is developed solely by [Estee Tey](https://www.github.com/lyqht). If you are keen on how the app idea came about, you can refer to the [motivations section](#motivations-for-building-the-app).

- Live progress on this project can be found in [this #BuildInPublic tweet thread](https://twitter.com/estee_tey/status/1511017683440996359).  
- For more in-depth details on planned & implemented features, you could refer to [ROADMAP.md](./ROADMAP.md).

## Tech Notes

### Building blocks of this project

- [UI Kittens](https://github.com/akveo/react-native-ui-kitten) for UI components
- [Supabase](https://github.com/supabase/supabase) for Database & Auth. Data is served by REST.
- [React Native MMKV](https://github.com/mrousavy/react-native-mmkv) for caching
- [Notifee](https://github.com/invertase/notifee) for creating & editing notifications (not implemented yet!)
- [Custom GitHub action for generating Supabase database types](https://blog.esteetey.dev/how-to-create-and-test-a-github-action-that-generates-types-from-supabase-database)
### Misc Tech Notes

If you are interested on some other tech notes how this app is built (e.g. how the app is bootstrapped, mockup etc), check out the [tech notes](./TECH_NOTES.md).

## Set up instructions

Install the node modules & pods 

```
npm i
npx pod-install
```

Then run 1 of the commands 
```
npm run ios
npm run android
```

You would need the Supabase project related environment variables as mentioned in `.env.sample`. You can create your own project and replace those values. 

---

## Motivations for building the app

I had built Billy intended for these few specific target audiences:
- Less tech-savvy users like my mom, who are **only-mobile users**, and prefer having **specific apps for specific functionalities**. They would benefit heavily from native notifications to keep track of their bills.
- Techies like me who are less organized, but has a ton of subscriptions to remember to manage and pay on time. Many times, I also **don't want to automatically renew these subscriptions** if I don't use them much during the trial period. 

My mom & I both like cute stuff, so that's how _Billy_ has its name.

## Memes

<div style="display: grid; place-items:center;">
    <img width="350" src="./demo/concerned_billy.png"></img>
</div>

<br />

Some funny tweet threads about Billy:
- [Concerned Billy](https://twitter.com/RubyNovaDev/status/1511390234440839175)
- [When a user is reckless in their waifu purchases](https://twitter.com/estee_tey/status/1512439733409878018)