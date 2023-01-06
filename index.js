const nearAPI = require('near-api-js');
const sha256 = require('js-sha256');
//this is required if using a local .env file for private key
require('dotenv').config();
const { keyStores, KeyPair , connect, WalletConnection} = nearAPI;

// configure accounts, network, and amount of NEAR to send
// the amount is converted into yoctoNEAR (10^-24) using a near-api-js utility
const sender = 'nadalab.testnet';
const receiver = 'nadalab1.testnet';
const networkId = 'testnet';
const amount = nearAPI.utils.format.parseNearAmount('1.5');
const amount2 = nearAPI.utils.format.parseNearAmount('1000');


const myKeyStore = new keyStores.InMemoryKeyStore();
// sets up a NEAR API/RPC provider to interact with the blockchain
const provider = new nearAPI.providers
  .JsonRpcProvider(`https://rpc.${networkId}.near.org`);

// creates keyPair used to sign transaction
const privateKey = process.env.PRIVATE_KEY;


async function main() {
  //const privateKey = "ed25519:3KGwbhyrDpQiVXh3Jt2uXT3twLSsVuXXusTDzWfTbFqbQAevqJGiXyDNdRg2QzFofZvwhhtJnmN8ShNpj1gyNnht";
  const keyPair = KeyPair.fromString(privateKey);
  await myKeyStore.setKey("testnet", "nadalab.testnet", keyPair);
  console.log('Processing transaction...');

  const connectionConfig = {
    networkId: "testnet",
    keyStore: myKeyStore, // first create a key store 
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
  };
  const nearConnection = await connect(connectionConfig);

  const account = await nearConnection.account("nadalab.testnet");

  const walletConnection = new WalletConnection(nearConnection);



 
  // constructs actions that will be passed to the createTransaction method below
  const myActions = [nearAPI.transactions.transfer(amount), nearAPI.transactions.transfer(amount2)];
  

 
  // create transaction
  const transaction = nearAPI.transactions.createTransaction(
    receiver, 
    myActions
  );

  const transaction2 = nearAPI.transactions.createTransaction(
    sender,
    receiver,
    myActions
  )

  console.log('problem here');
  const result = await account.signAndSendTransaction({
    receiverId: 'nadalab1.testnet',
    actions: myActions,
    returnError:true
  });
  console.log(result);

}

main();