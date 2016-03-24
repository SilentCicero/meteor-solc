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
            jsContent += "var web3 = {};";

            jsContent += "if(typeof window.web3 !== 'undefined')";
            jsContent += "web3 = window.web3;";

            jsContent += "if(typeof global.web3 !== 'undefined')";
            jsContent += "    web3 = global.web3;";

            jsContent += "if(typeof window.web3 === 'undefined'";
            jsContent += "  && typeof global.web3 === 'undefined'";
            jsContent += "  && typeof Web3 !== 'undefined')";
            jsContent += "    web3 = new Web3();";
            
            jsContent += "\n\n " + name + ' = ' + ' web3.eth.contract(' +JSON.parse(JSON.stringify(results.contracts[name].interface, null, '\t')).trim() + ')' + '; \n\n';

            jsContent += "" + name + ".bytecode = '" + results.contracts[name].bytecode + "'; \n\n";
            
            //jsContent += " export { " + name + " as " + name + " };";
            
            //jsContent += "module.export = {" + name + ": " + name + "};";
            
            console.log(jsContent);
        }
    }

    compileStep.addJavaScript({
        path: compileStep.inputPath + '.js',
        sourcePath: compileStep.inputPath,
        data: jsContent
    });
};


Plugin.registerSourceHandler("sol", {}, fileModeHandler);