import TruffleContract from 'truffle-contract';
import TruffleDeployer from 'truffle-deployer';
// Import contracts
import MycroCoinData from './build/contracts/MycroCoin.json';
import BaseDaoData from './build/contracts/BaseDao.json';
import MergeAscData from './build/contracts/MergeASC.json';
import MergeModuleData from './build/contracts/MergeModule.json';

import client from './GraphqlClient.js';
import gql from 'graphql-tag';

//TODO have backup providers here
const provider = window.web3.currentProvider;
const web3 = window.web3;



const createTruffleContract = (data) => {
  const contract = TruffleContract(data);
  contract.setProvider(provider);
  contract.defaults({from: web3.eth.accounts[0]});
  return contract;
};

const deployHelper = (contract, ...args) => {
  //TODO use a promise here to avoid race condition
  var a = window.web3.eth.accounts[0];
  // a = undefined;
  return deployer.deploy(contract, ...args, {from: a});
};

var deployer = null;
web3.version.getNetwork(function (err, id) {
  const network_id = id;

  deployer = new TruffleDeployer({
    contracts: [BaseDaoData],
    network: "test",
    network_id: network_id,
    provider: provider
  });

  deployer.start();
});
const Contracts = {
  MycroCoin: TruffleContract(MycroCoinData),
  BaseDao: TruffleContract(BaseDaoData),
  MergeAsc: TruffleContract(MergeAscData),
  MergeModule: TruffleContract(MergeModuleData),
};

//add providers
Object.keys(Contracts).forEach((contract) => {
  Contracts[contract] = createTruffleContract(Contracts[contract]);
});

const deployedMycro = () => {
  //TODO don't hardcode and actually grab it with graphql dynamically
  const query = gql`query{
  mycroDao 
}`;
  return client.query({query}).then(({data: {mycroDao: address}}, error) => {
    console.log("Mycro dao address is " + address);
    return Contracts.MycroCoin.at(address);
  });
}
Contracts.MycroCoin.deployed = deployedMycro;


export {
  Contracts,
  deployHelper,
  createTruffleContract,
};

