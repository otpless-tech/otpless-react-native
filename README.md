# otpless-react-native

otpless react module for android and ios

## Installation

```sh
npm install otpless-react-native
```

## Usage

```js
import { OtplessEventModule, OtplessModule } from 'otpless-react-native';

// create otpless event module
const eventModule = new OtplessEventModule((result: any) => {
    let message: string = '';
    if (data.data === null || data.data === undefined) {
      message = data.errorMessage;
    } else {
      message = `token: ${data.data.token}`;
      // todo here
    }
  });

// to start the sdk
eventModule.start();

// after sign in completed
eventModule.onSignInCompleted();


// to remove all callbacks
eventModule.clearListener()

// optional
// if sign-in fab button is not needed. default it is true.
eventModule.showFabButton(false)

// ...

const result = await multiply(3, 7);
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
