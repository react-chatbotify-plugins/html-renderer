<p align="center">
  <img width="200px" src="https://raw.githubusercontent.com/react-chatbotify-plugins/html-renderer/main/src/assets/logo.webp" />
  <h1 align="center">Html Renderer</h1>
</p>

<p align="center">
  <a href="https://github.com/react-chatbotify-plugins/html-renderer/actions/workflows/ci-cd-pipeline.yml"> <img src="https://github.com/react-chatbotify-plugins/html-renderer/actions/workflows/ci-cd-pipeline.yml/badge.svg" /> </a>
  <a href="https://www.npmjs.com/package/@rcb-plugins/html-renderer"> <img src="https://img.shields.io/npm/v/@rcb-plugins/html-renderer?logo=semver&label=version&color=%2331c854" /> </a>
  <a href="https://www.npmjs.com/package/@rcb-plugins/html-renderer"> <img src="https://img.shields.io/badge/react-16--19-orange?logo=react&label=react" /> </a>
</p>

## Table of Contents

* [Introduction](#introduction)
* [Quickstart](#quickstart)
* [Features](#features)
* [API Documentation](#api-documentation)
* [Team](#team)
* [Contributing](#contributing)
* [Others](#others)

### Introduction

<p align="center">
  <img height="400px" src="https://github.com/user-attachments/assets/1de55c27-e135-4d7a-90a9-75e573e2c34e" />
</p>

**Html Renderer** is a plugin that adds support for rendering html in chat bubbles within the [**React ChatBotify Core Library**](https://react-chatbotify.com). By default, the core library does not ship with html support. This plugin relies on chatbot events to intercept messages and determine if html rendering logic has to be applied. The demo gif above should give you a pretty good idea of what this plugin is capable of doing.

For support, join the plugin community on [**Discord**](https://discord.gg/J6pA4v3AMW) to connect with other developers and get help.

### Quickstart

The plugin is incredibly straightforward to use and is [**available on npm**](https://www.npmjs.com/package/@rcb-plugins/html-renderer). Simply follow the steps below:

1. Install the plugin with the following command within your project folder:
   ```bash
   npm install @rcb-plugins/html-renderer
   ```

2. Import the plugin:
   ```javascript
   import HtmlRenderer from "@rcb-plugins/html-renderer";
   ```

3. Initialize the plugin within the `plugins` prop of `ChatBot`:
   ```javascript
   import ChatBot from "react-chatbotify";
   import HtmlRenderer from "@rcb-plugins/html-renderer";

   const MyComponent = () => {
     return (
       <ChatBot plugins=[HtmlRenderer()]/>
     );
   };
   ```

4. Add the `renderHtml` attribute to the [**Block**](https://react-chatbotify.com/docs/concepts/conversations#block) that requires html rendering:
   ```javascript
   import ChatBot from "react-chatbotify";
   import HtmlRenderer, { HtmlRendererBlock } from "@rcb-plugins/html-renderer";

   const MyComponent = () => {
     const flow = {
       start: {
         message: "<h4>What is your age?</h4>",
         renderHtml: ["BOT", "USER"]
       } as HtmlRendererBlock
     }

     return (
       <ChatBot plugins=[HtmlRenderer()]/>
     );
   };
   ```

The quickstart above shows how rendering of html can be done for both bot and user messages **within the start block**. The documentation website for the React ChatBotify Core Library also contains a [**live html renderer example**](https://react-chatbotify.com/docs/examples/html_render) that uses this plugin. You may wish to check it out!

### Features

**Html Renderer** is a lightweight plugin that provides the following features to your chatbot:
- Render html in bot chat messages
- Render html in user chat messages
- Optionally pass in your own custom html component to render html your way

### API Documentation

#### Plugin Configuration

The `HtmlRenderer` plugin accepts a configuration object that allows you to customize its behavior and appearance. An example configuration is passed in below to initialize the plugin:

```javascript
import ChatBot from "react-chatbotify";
import HtmlRenderer from "@rcb-plugins/html-renderer";

const MyComponent = () => {
  const pluginConfig = {
    // defaults to true, auto enable events required for plugin to work
    autoConfig: true,
  }

  return (
    <ChatBot plugins={[HtmlRenderer(pluginConfig)]}/>
  )
}
```

As you may be able to tell from above, there are 5 configurable sections within the plugin configuration which are `autoConfig`, `promptBaseColors`, `promptHoveredColors`, `textAreaHighlightColors` and `advancedStyles`. These are described in the table below:

| Configuration Option         | Type     | Default Value                                                                                                                                                                                                                 | Description                                                                                                               |
|------------------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| `autoConfig`                 | boolean  | `true`                                                                                                                                                                                                                        | Enables automatic configuration of required events for html rendering. Recommended to keep as `true`. If set to `false`, you need to configure events manually. |
| `htmlComponent`                 | React.ComponentType<{ children: React.ReactNode }>  | `null`                                                                                                                                                                                                                        | A React component to wrap around the message's content to customize its styling, layout, or behavior. The component will receive the message's content as its children prop, so you can design it to add custom formatting, animations, or other UI enhancements. If not provided, a default wrapper from **react-html** will be used. |

#### Rendering Html

To render html in messages, add the `renderHtml` attribute to any Block that requires html rendering. The `renderHtml` attribute is an array that accepts senders such as `"USER"` and/or `"BOT"`. An example can be seen below:

```javascript
import ChatBot from "react-chatbotify";
import HtmlRenderer from "@rcb-plugins/html-renderer";

const MyComponent = () => {
  const flow = {
    start: {
      message: "<h4>What is your age?</h4>",
      renderHtml: ["USER", "BOT"],
    },
    // ... other blocks
  };

  return (
    <ChatBot plugins={[HtmlRenderer(pluginConfig)]}/>
  )
}
```

As you can see from the example above containing a `start` block, `renderHtml` contains both `"USER"` and `"BOT"`, which means it will render html messages for both user and bot messages within the `start` block.

### Team

* [Tan Jin](https://github.com/tjtanjin)

### Contributing

If you have code to contribute to the project, open a pull request from your fork and describe 
clearly the changes and what they are intended to do (enhancement, bug fixes etc). Alternatively,
you may simply raise bugs or suggestions by opening an issue.

### Others

For any questions regarding the project, please reach out for support via **[discord](https://discord.gg/J6pA4v3AMW).**
