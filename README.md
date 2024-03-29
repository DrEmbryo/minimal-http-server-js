# Node.js http server

## About this project

The HTTP server project in pure JavaScript is a personal endeavor aimed at building a lightweight and customizable web server entirely using JavaScript.

## Installation guide

Features I've implemented so far:

- Core Functionality: handling incoming HTTP requests, processing them, and sending appropriate responses.
- Routing and Request Handling: includes routing mechanisms to direct incoming requests to the appropriate handlers based on the requested URL paths.
- Middleware Support: support of middleware functions, enabling the execution of additional logic before handling requests.
- Template engines support: support of template engines like ejs, pug, etc., enabling the execution of template logic.
- Static File Serving: The server can serve static files such as HTML, CSS, JavaScript, images, and other assets to clients upon request, enhancing its capabilities for web development projects.

### Installation option:

- Nix flake + pnpm:
  1. Allow [nix flakes](https://nixos.wiki/wiki/Flakes) in your configuration
  2. Open dev shell in your terminal by running `nix develop`
  3. Install all dependencies by running `pnpm install`
  4. Execute `node main.js` script
- Without usage of nix
  1. Install Node.js (current version is 19_x)
  2. Install all dependencies by running your package manager of choice
  3. Execute `node main.js` script

### Running the app:

optional cli argument (--directory <name of dir>) can be passed for file routes
