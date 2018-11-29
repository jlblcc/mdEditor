mdEditor
========

[![Build Status](https://travis-ci.org/adiwg/mdEditor.svg?branch=develop)](https://travis-ci.org/adiwg/mdEditor)

Web application for writing metadata. Built using [ember.js](http://emberjs.com/).

See [CONTRIBUTING.md](./CONTRIBUTING.md) for info on making contributions.

Also, see the [wiki](https://github.com/adiwg/mdEditor/wiki) for more info about the project.

## Prerequisites (for development)

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone https://github.com/adiwg/mdEditor.git` this repository
* `cd mdEditor` change into the new directory
* `npm install`
* `bower install`

## Running / Development

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

By default, this will deploy to GitHub pages:

 `ember deploy staging`

 Note that the `gh-pages` branch must exist in the git repository. See [ember-cli-deploy-git](https://github.com/ef4/ember-cli-deploy-git#usage) for details.

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
