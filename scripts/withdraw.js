const { ethers } = require("hardhat");
const abi = require("../artifacts/contracts/BuyMeACoffe.sol/BuyMeACoffee.json");
// fronted kısmında birbirleriyle etkileşim halinde olmaya yarıyor 


// adrese göre bakiyeyi gösteriyor 
async function getBalance(provider, address) {
    const balanceBigInt = await provider.getBalance(address);
    return ethers.utils.formatEther(balanceBigInt);
}

async function main() {
    // kont. adresi 
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const contractABI = abi.abi;

    // cüzdanı goerli agına kullanmak 
    const provider = new ethers.providers.AlchemyProvider("goerli", process.env.GOERLI_API_KEY);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider); // imzalama gibi

    // gerekli parametler gibi 
    const buyMeAcoffee = new ethers.Contract(contractAddress, contractABI, signer);

    // owner hesabında kaç eth oldugunu gösterir
    console.log("current balance of owner :", await getBalance(provider, signer.address), "ETH");
    const contractBalance = await getBalance(provider, buyMeAcoffee.address);
    // kont. hesabaını gösterir 
    console.log("current balance of contract:", await getBalance(provider, buyMeAcoffee.address), "ETH");

    // kont. hesabı 0 degilse eth çek eger 0 ise zaten çekmene gerek yok 
    if (contractBalance !== "0.0"){
        console.log("withdrawing funds...")
        const withdrawTxn = await buyMeAcoffee.withdrawTips();
        await withdrawTxn.wait();
    } else {
        console.log("no funds to withdraw");
    }

    // işlem bitince hesabın son halini alacaz 
    console.log("current balance of owner : " , await getBalance(provider , signer.address), "ETH");

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
