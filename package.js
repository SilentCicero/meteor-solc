Package.describe({
  name: 'silentcicero:solc',
  summary: 'The solc package provides a compiler build plugin for the Meteor build tool.',
  version: '0.2.1',
  git: 'http://github.com/SilentCicero/meteor-solc'
});

Package.registerBuildPlugin({
    name: "compileSol",
    use: [
        "silentcicero:solc-compiler@0.1.5-1"
    ],
    sources: [
        "plugin/handler.js",
    ]
});