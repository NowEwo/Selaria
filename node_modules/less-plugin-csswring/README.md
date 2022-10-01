less-plugin-csswring
=====================

Compresses the css output from Less using csswring.

## lessc usage

```
npm install -g less-plugin-csswring
```

and then on the command line,

```
lessc file.less --csswring="--sourcemap  --preserve-hacks"
```

See [csswring](https://github.com/hail2u/node-csswring) for the available command options.

## Programmatic usage

```
var LessPluginCSSwring = require('less-plugin-csswring'),
    csswringPlugin = new LessPluginCSSwring({sourcemap: true});
less.render(lessString, { plugins: [csswringPlugin] })
  .then(
```

## Browser usage

Browser usage is not supported at this time.
