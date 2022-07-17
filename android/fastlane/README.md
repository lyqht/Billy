fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## Android

### android test

```sh
[bundle exec] fastlane android test
```

Runs all the tests

### android vc_and_tag

```sh
[bundle exec] fastlane android vc_and_tag
```

Increment version code and add git tag

### android bundle

```sh
[bundle exec] fastlane android bundle
```

Create a new app bundle for release

### android internal

```sh
[bundle exec] fastlane android internal
```

Submit a new bundle to Play Store: Internal Track

### android alpha

```sh
[bundle exec] fastlane android alpha
```

Submit a new bundle to Play Store: Closed Testing Track

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
