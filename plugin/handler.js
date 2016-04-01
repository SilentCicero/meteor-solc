var solc = Npm.require('solc');

function has(object, key) {
  return object ? hasOwnProperty.call(object, key) : false;
}

'use strict';

class SolidityCompiler extends CachingCompiler {
	constructor() {
		super({
			compilerName: 'solidity',
			defaultCacheSize: 1024 * 1024 * 10,
		});
	}

	getCacheKey(inputFile) {
		return inputFile.getSourceHash();
	}

	compileResultSize(compileResult) {
		return compileResult.source.length + compileResult.sourceMap.length;
	}

	compileOneFile(inputFile) {
		var name = inputFile._resourceSlot.inputResource.path.split("/").pop();
		name = name.split('.')[0];

		var output = solc.compile(inputFile.getContentsAsString(), 1);

		if (has(output, 'errors'))
			return inputFile.error({
				message: "Solidity errors: " + String(output.errors)
			});
		
		var results = output,
			jsContent = "";

		for (var contractName in results.contracts) {
			if (contractName == name) {
				jsContent += "var web3 = {};";

				jsContent += "if(typeof window.web3 !== 'undefined')";
				jsContent += "web3 = window.web3;";

				jsContent += "if(typeof window.web3 === 'undefined'";
				jsContent += "  && typeof Web3 !== 'undefined')";
				jsContent += "    web3 = new Web3();";

				jsContent += "\n\n " + name + ' = ' + ' web3.eth.contract(' + JSON.parse(JSON.stringify(results.contracts[name].interface, null, '\t')).trim() + ')' + '; \n\n';

				jsContent += "" + name + ".bytecode = '" + results.contracts[name].bytecode + "'; \n\n";
			}
		}

		return {
			source: jsContent,
			sourceMap: ''
		};
	}
	
	addCompileResult(inputFile, compileResult) {
		inputFile.addJavaScript({
			path: inputFile.getPathInPackage() + '.js',
			sourcePath: inputFile.getPathInPackage(),
			data: compileResult.source,
			sourceMap: compileResult.sourceMap,
		});
	}
}

Plugin.registerCompiler({
	extensions: ['sol'],
}, () => new SolidityCompiler());
