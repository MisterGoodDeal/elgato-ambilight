<h1 style="text-align: center;">💡Elgato Ambilight</h1>
<p style="text-align: center; width: 100%"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://raw.githubusercontent.com/MisterGoodDeal/elgato-ambilight/main/Screenshot_2022-11-28_at_21.32.50.png" alt="" /></p>

This app allow you to use your **Elgato KeyLight** and **Elgato KeyLight** Air as an **ambient light** working with your **system**. It works on Windows and MacOS X

## ✨ Features

- [X] Basic controls for each light (brigthness and temperature)
- [X] Enable or disable the ambilight feature
- [X] Change the refresh rate of the light picking the color from your screen
- [X] Change the max brightness the lights output when using the ambilight feature

## ⚠️ Limitations and requirements

In order to work properly, you need to have the `Bonjour!` service installed on your computer. This service allow the discovery and the control of the light over the network. 

As you can you can change the refresh rate of the ambilight. This settings will denpends on your network and light capability at sending/receiving network requests. I've tested many different refresh rates and here's my conclusion:

### Setup
- Tested with a computer connected to 1Gb ethernet router
- Lights are connected to the WiFi 6 router (I'm not sure it makes any differences since the lights aren't WiFi 6 ready?)

### Recommended settings
- 5 FPS: Enough when playing a chill game, watching videos...
- 7-10 FPS: If you want more responsiveness, but the network might drop some frames
- 15 FPS: The max framerate my network/lights can handle before being saturated

## 🖥️ Install on Windows

For the moment there's no current Windows installer because it breaks the app and I can't figure out why. Instead you can use the portable version of the app. 

1. Go to the [release page](https://github.com/MisterGoodDeal/elgato-ambilight/releases) and download the latest version of `Elgato Ambilight-win32-x64.zip`.
2. Unzip the archive we're you want to store the app
3. Run the `Elgato Ambilight.exe` in order to start the app.

🎊 That's it!

## 💻 Install on MacOS
 
1. Go to the [release page](https://github.com/MisterGoodDeal/elgato-ambilight/releases) and download the latest version of `Elgato_Ambilight-darwin-x64-x.x.x.zip`.
2. Drag and drop the `Elgato Ambilight.app` in your `Application` directory
3. Run  `Elgato Ambilight.app` in order to start the app.

🎊 There you go!

## 🐛 Report a bug 

If you encounter a bug or if you have any kind of suggestions, feel free to open an issue on GitHub. If you don't have a GitHub account you can send me an email at [mcamus@turtlecorp.fr](mailto:mcamus@turtlecorp.fr) or send me a message on Discord (`Miaou 😼#5555`).

## 🔀 Pull requests

Every pull requests are welcome, feel free to clone the repository and edit the code 😉
