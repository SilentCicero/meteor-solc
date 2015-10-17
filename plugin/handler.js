var contracts = {};

var getCompilerResult = function (compileStep, fileMode) {
    var content = compileStep.read().toString('utf8');
    try {      
        var output = solc.compile(content, 1);
        
        if(output['errors'])
            return compileStep.error({
                message: "Solidity syntax error: " + output['errors'],
                sourcePath: compileStep.inputPath
            });
        
        return output;
    } catch (exception) {
        return compileStep.error({
            message: "Solidity syntax error: " + exception,
            sourcePath: compileStep.inputPath
        });
    }
};

var fileModeHandler = function (compileStep) {
    var results = getCompilerResult(compileStep, true),
        jsContent = "",
        name = compileStep.pathForSourceMap.substring(0, compileStep.pathForSourceMap.lastIndexOf('.'));
    
    for (var contractName in results.contracts) {    
        if(contractName == name) {
            jsContent += "\n\n" + name + ' = ' + ' web3.eth.contract(' +JSON.parse(JSON.stringify(results.contracts[name].interface, null, '\t')).trim() + ')' + '; \n\n';

            jsContent += name + ".bytecode = '" + results.contracts[name].bytecode + "'; \n\n";
        }
    }

    compileStep.addJavaScript({
        path: compileStep.inputPath + '.js',
        sourcePath: compileStep.inputPath,
        data: jsContent
    });
};


Plugin.registerSourceHandler("sol", {}, fileModeHandler);