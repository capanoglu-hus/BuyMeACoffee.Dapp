const { ethers , waffle } = require("hardhat");

// adresi ve adrs bakiyesini alır 
async function getBalance(address){
  const balanceBigInt = await waffle.provider.getBalance(address);
  return ethers.utils.formatEther(balanceBigInt);
}

async function printBalances(addresses){
  let idx = 0 ; 
  for (const address of addresses){
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx ++; 
  }
} 

// log mesajlarıyla ilgili ayrıntıyı tutar 
async function printMemos(memos){
  for (const memo of memos){
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message; 
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
  }

}

async function main() {

    const BuyMeACoffee = await ethers.getContractFactory("BuyMeACoffee");
    const buyMeAcoffee = await BuyMeACoffee.deploy() ;
    
    await buyMeAcoffee.deployed();
    console.log("BuyMeACoffee deployed to " , buyMeAcoffee.address) ;
  // örnek hesap oluşturma 
  const [owner, tipper, tipper2, tipper3] =  await ethers.getSigners();
  
  // kont. deploy olacak 
   

  // eth çekme olsyı 
  const addresses = [owner.address , tipper.address , buyMeAcoffee.address];
  console.log("===start===");
  await printBalances(addresses);

  // kahve almaları ve not yazmaları 
  const tip = {value: ethers.utils.parseEther("1")};
  await buyMeAcoffee.connect(tipper).buyCoffee("tony " , " messsage stark " , tip);
  await buyMeAcoffee.connect(tipper2).buyCoffee("jon " , " messsage stark " , tip); 
  await buyMeAcoffee.connect(tipper3).buyCoffee("rob " , " messsage stark " , tip);  

  // kahve aldıktan sonra hesap kontrolu 
  console.log("===COFFEE===");
  await printBalances(addresses);

  // eth hesaptan çekme 
  await buyMeAcoffee.connect(owner).withdrawTips();  

  // eth çekildikten sonra hesap kontrolu 
  console.log("===withdraw===");
  await printBalances(addresses);
  

  //yazılmış olan tüm notları gösterme 
  console.log("==memos===")
  const memos = await buyMeAcoffee.getMemos();
  printMemos(memos);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });