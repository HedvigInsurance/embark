# Embark

Embark is Hedvigs framework for creating forms and user stories. For the content editor's docs - see [embark-docs.herokuapp.com](https://embark-docs.herokuapp.com).

The Embark repository serves three use cases;

- Serve [angel-data](./angel-data) files to embark clients via the [server.ts](./server.ts) server
- Holds the web UI implementation that web-onboarding and the preview in Angel uses via an NPM package
- Serves the live package (format.js), via the same server as angel-data is served via, that Angel uses to preview the flows

## angel-data and format.js

The server that serves the Angel preview file and angel-data is built with `yarn build-server` and then started with `yarn start`. In dev/prod this server is run with the docker container and run in kubernetes and hence deployed via prod-env.

Steps to deploy:

- Merge your changes to master/main
- Wait for Codefresh to build the docker container. It will be deployed to dev automatically, you can see when it's deployed in the [#platform-deploy](https://hedviginsurance.slack.com/archives/C01PGTP0VK4) Slack channel.
- Use the deployment helper script in prod-env to deploy to prod (see separate instructions in that repository). You can follow the progress in hte [#platform-deploy](https://hedviginsurance.slack.com/archives/C01PGTP0VK4) Slack channel

To develop: use `yarn start`

## The NPM package

The web UI is distributed (to the web onboarding) via an NPM package. It is published via CI to NPM by making a Git tag with `yarn version`.

Steps to deploy:

- Run `yarn version` and bump the version while on the master/main git branch
- Push the Git tag created to GitHub with `git push origin master && git push --tags`
- Once the tag is built in CodeFresh approve the NPM package deployment by pressing `approve` in the CI pipeline

To develop: Use Storybook (start with `yarn storybook`) to develop individual components - if they aren't yet Storybooked make sure to first storybookify them. If you want to test Embark in a context use `yarn link` to link the package. For each change you make you'll need to use `yarn build-package` for it to propagate to the changes you made into the "production" (linked) build.
