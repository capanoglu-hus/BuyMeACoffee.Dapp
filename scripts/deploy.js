const { ethers  } = require("hardhat");

async function main() {
   // kont. deploy olacaK

    const BuyMeACoffee = await ethers.getContractFactory("BuyMeACoffee");
    const buyMeAcoffee = await BuyMeACoffee.deploy() ;
    
    await buyMeAcoffee.deployed();
    console.log("BuyMeACoffee deployed to " , buyMeAcoffee.address) ;

  
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
  console.error(error);
  process.exitCode = 1;
});