# Bridge Deployer

> **Retired.** This tool no longer works and is no longer maintained. To run self-hosted bridges, use [Beeper Bridge Manager (`bbctl`)](https://github.com/beeper/bridge-manager) v0.15.0 or newer. Bridges you already deployed keep running; remove one with `bbctl delete <bridge name>` and delete the app from your Fly.io dashboard.

A web app that deploys self-hosted bridges to your [fly.io](https://fly.io) account.

### How to run locally

Clone the repo:
```commandline
git clone https://github.com/beeper/self-host-web.git
```

Install dependencies:
```commandline
yarn install
```

Start the web app:
```commandline
yarn dev
```

Then, open up [http://localhost:3000](http://localhost:3000) on your computer to access the site.
