# visue
vue visualizing dev tool


## Feature

Visue aims at providing a desktop app to simplity front end coding. By combining electron UI and grammar analysis tool, visue is designed to enable developers:

* Visually inspect Vue component template, and easily load new components into the template tree.
* Visually inspect Vuex state / actions / mutations relating to a specific component, and CRUD corresponding code to implement feature in visue GUI.
* Visually modify backend GUI ajax code encapsulated in promise.

![visue-poc](http://7u2gqx.com1.z0.glb.clouddn.com/visue-poc-1x.png)

Visue is a dev tool rather than a framework / lib. It works like a code editor optimized for vue-based front end development workflow, all related project files can be opened and edited by visue, making it possible to opt-in your current workflow without any change to existing code.


## Development
Visue use webpack for electron user interface. Using following commands for webpack builds:

``` text
npm run dev  # run admin development build
npm run prod # run admin production build
```

If error occurs when opening electron app, comment out the `BrowserWindow.addDevToolsExtension` code in `main.js` and retry.


## Install
TODO
