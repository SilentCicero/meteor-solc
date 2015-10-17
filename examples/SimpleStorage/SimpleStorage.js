// Within the client
if (Meteor.isClient) {
    // disconnect any meteor server
    if(location.host !== 'localhost:3000' && location.host !== '127.0.0.1:3000')
        Meteor.disconnect();
    
    Meteor.startup(function() {
        web3.setProvider(new web3.providers.HttpProvider('http://159.203.98.48:8545/'));
    });
    
    var contractInstance = null;
    
    Template.contractInterface.onRendered(function(){
        TemplateVar.set('state', '');
    });
        
    Template.contractInterface.events({
        /**
        Deploy a new SimpleStore contract.

        @event (click .btn-new)
        **/
        
        'click .btn-new': function (event, template) {
            SimpleStorage.new({data: SimpleStorage.bytecode, from: web3.eth.accounts[0], gas: 300000}, function(err, result){
                if(err)
                    return TemplateVar.set(template, 'state', 'There was an error: ' + err);
                
                if(result.transactionHash)
                    TemplateVar.set(template, 'state', 'Your SimpleStore contract is being deployed with transaction hash: ' + result.transactionHash);
                    
                // just to show an '.at' usage here
                if(result.address) {
                    contractInstance = SimpleStorage.at(result.address);
                    TemplateVar.set(template, 'state', 'SimpleStore contract deployed to address: ' + result.address + ', now you can use the set and get functions');
                }
            });
        },

        /**
        Set the storedData variable in the contract.

        @event (click .btn-set)
        **/
        
        'click .btn-set': function (event, template) {
            if(!contractInstance)
                return TemplateVar.set(template, 'state', 'There is no SimpleStore contract deployed');
            
            contractInstance.set.sendTransaction(45, {from: web3.eth.accounts[0], gas: 300000}, function(err, result){
                if(err)
                    return TemplateVar.set(template, 'state', 'There was an error: ' + err);
                
                if(result)
                    TemplateVar.set(template, 'state', 'Setting your SimpleStore contract data. The transaction hash is: ' + result + ' keep calling the `get` method to see if the data has been set.');
            });
        },

        /**
        Get the stored value from the contract.

        @event (click .btn-get)
        **/
        
        'click .btn-get': function (event, template) {
            if(!contractInstance)
                return TemplateVar.set(template, 'state', 'There is no SimpleStore contract deployed');
            
            contractInstance.get.call(function(err, result){
                if(err)
                    return TemplateVar.set(template, 'state', 'There was an error: ' + err);
                
                if(result)
                    TemplateVar.set(template, 'state', 'Stored contract data is: ' + result.toNumber(10));
            });
        }
    });
}