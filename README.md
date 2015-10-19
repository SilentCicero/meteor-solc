# Solidity for Meteor
The solc package provides a compiler build plugin for the Meteor build tool. It
handles the compilation of `*.sol` files to JS.

## Table of Contents

* [Installation](#installation)
* [Examples](#examples)
* [Usage](#usage)
* [Compiler](#compiler)
  * [NPM](#npm)
  * [Meteor](#meteor)
* [About](#about)
* [Error Handling](#error-handling)
* [Components](#components)
* [License](#license)

## Installation

    $ meteor add silentcicero:solc

## Examples

Examples of `.sol` files with Meteor can be found in the <a href="http://github.com/silentcicero/meteor-solc/master/blob/examples">examples</a> directory.

## Usage

Code in the Solidity programming language as you normally would in `.sol` files. 
The location of the `.sol` file will determine the placement of its contract's web3 JS object.
Currently, `meteor-solc` will compile and deliver the contract of the document it's named after, so `NameReg.sol` will provide a global contract object for the `NameReg` contract within that document. 
Compiled contract byte code will come attached to the contract object as the `.bytecode` string property (see example below).

```
# app/contracts/SimpleStorage.sol
contract SimpleStorage {
  uint public storedData;

  function SimpleStorage(uint initialValue) {
    storedData = initialValue;
  }

  function set(uint x) {
    storedData = x;
  }
  function get() constant returns (uint retVal) {
    return storedData;
  }
}
```

```javascript
# app/index.js
var myContractInstance = SimpleStorage.new({data: SimpleStorage.bytecode, gas: 30000}, ...);
// or
// var myContractInstance = SimpleStorage.at('<some_address>');
myContractInstance.set.sendTransaction(...);
myContractInstance.get.call(...);
```

## Compiler

`meteor-solc` depends on the `meteor-solc-compiler` package which contains just the SOL compiler. The compiler is built with the Ethereum solc compiler. The solc compiler is available below for both Meteor and NPM:

### NPM

    $ npm install solc

### Meteor

    $ meteor add silentcicero:solc-compiler

## About

The idea behind `meteor-solc` is to make building a Meteor dApp extremely fluent. Now you don't need to think about contract compiling and placement. The `.sol` file type is used just like `.less` or any other pre-compiled document and converted into a `.js` file. 
Let Meteor's compiling platform take care of load staging and JS preparation. 

## Error Handling

All compiling errors will appear in your Meteor terminal and in the browser, the same way all Meteor errors are displayed and handled.

## Components

* [web3](https://github.com/ethereum/web3.js) v0.13.0
* [browser-solidity](https://github.com/chriseth/browser-solidity) v0.1.5-1

## Todo

 - 1. [Better Naming & Selection] Having the file name as the contract selector does not abide by Meteor's file-naming philosophy. The reason for doing it this way, is because duplicate contract titles can lead to duplicate global objects being built (thus potentially causing unwanted global variable overriding). In order to stop this, strict file naming will act as the contract selector for now. Eventually this will be phased out for a more comprehensive contract selection process.

## License

meteor-solc is under the MIT License type.

Copyright (c) 2015 Nick Dodson. http://nickdodson.com
