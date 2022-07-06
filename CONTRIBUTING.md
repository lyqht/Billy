# Contributing

## Introduction 

Hello there! Thanks for considering to contribute to Billy 💚

Billy is still **very early in the development phase** (refer to [**ROADMAP**](https://lyqht.github.io/Billy/docs/roadmap/checklist)), so there may not be a lot of features and there may be bugs 🤐

Refer to the section on [creating issues](#creating-issues) if you would like to report anything!

## ⚠️ Ground rules

### Keeping GitHub a safe environment

This is an open source project. Do not harrass people for replies.

### Contributing guidelines

- **To be a Billy tester in Alpha Track**, fill up [this form](https://forms.gle/wuPpNzA3qiM3jcJ87).
- Bug and feature request issues are only prioritised if they are raised by testers in the Internal/Alpha Track. 
- PRs not linked to any issues will **not** be entertained, and **auto-closed after 3 days**.

### Creating issues
#### Feature Requests

Before opening a feature request issue, 
1. Please check the product [**ROADMAP**](https://lyqht.github.io/Billy/docs/roadmap/checklist) document if it is already planned to be implemented.
2. In the issue, discuss what you want to be done before implementing anything. This is to keep contributions aligned with the product roadmap and vision. 
3. Provide sufficient mockups/ screenshots/ flow diagrams whenever applicable.

#### Bugs

Please state your device model, and steps to replicate.

> If you're a Billy tester, please also email me that the link that of the created issue as well so I can communicate to you more easily if necessary.

## What you can contribute in

- **Be a Billy tester!**
  - Fill up [this form](https://docs.google.com/forms/d/e/1FAIpQLSfOIzpqG8y84FHHmqC3Jauy2RTx4xKd6M_oXDS5fBZ9kYFnlg/viewform) if you're keen to help to try out the app in the **Alpha Track**. Once you have submitted the form, I'll send an email to you within 3 working days with the app store link.
  - ⚠️ Billy is only available for Android users on Google Playstore now. If you're on iOS, you can still participate as a tester but you need to install the app locally by cloning the project & setting it up with env variables corresponding to your own Supabase project.
- **A product landing website**
  - it should display all the information that is already in the /docs folder.
  - it should have a form for users to request for data retrieval or removal
- **Improved documentation**
  - Spellings, rephrasing (for the better) are welcome.
  - If you have tried to setup Billy on your own and you find a gap in the setup instructions, feel free to add onto it.
  - Mermaid diagrams of how the tech side of things works
  - User journey diagrams of how users can use Billy
- **GitHub Issue templates**
  - feel free to add templates for the community to contribute to Billy more easily
- **GitHub Actions**
  - There's E2E Detox tests for Billy, but I haven't integrated it as part of the CICD yet (I also haven't write a lot of it). If you can help to contribute tests or create a workflow that runs the tests & save failing screenshots as artifacts, that will be great.
  - For this project, I've also created the [GitHub Action to generate Supabase database types](https://github.com/lyqht/generate-supabase-db-types-github-action), which is used by some devs. You can work on that too if you like!

