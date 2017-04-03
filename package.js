Package.describe({
  name: 'silentcicero:solc',
  summary: 'The solc package provides a compiler build plugin for the Meteor build tool.',
  version: '0.4.2',
  git: 'http://github.com/SilentCicero/meteor-solc'
});

Package.registerBuildPlugin({
    name: "compileSol",
    use: [
		"ecmascript@0.1.0",
		"isobuild:compiler-plugin@1.0.0",
		"caching-compiler@1.0.0"//,
        //"silentcicero:solc-compiler@0.2.1"
    ],
    sources: [
        "plugin/handler.js",
    ],
	npmDependencies: {
		"solc": "0.4.10"

	}
});

Package.onUse(function (api) {
	api.use("isobuild:compiler-plugin@1.0.0");
});
