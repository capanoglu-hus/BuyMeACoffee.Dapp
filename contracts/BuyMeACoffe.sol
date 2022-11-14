// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;



contract BuyMeACoffee {
    
    // event yazıp memo oluşturmak için

    event NewMemo (
        address indexed from ,
        uint256 timestamp ,
        string name ,
        string message 
    ) ;

    // memo yapısını oluşturacaz 

    struct Memo {
        address from ;
        uint256 timestamp ;
        string name ;
        string message ;
    }

    // kont. yazan adres ödeme alacagı için payable 
    address payable owner ;

    // memo yapısını dizi olarak tutacak 
    Memo[] memos ; 

  

    // yapılandırıcı 
    constructor (){
        owner = payable(msg.sender); 
    }

    // notların yayınlanması 
    function getMemos() public view returns (Memo[] memory){

        return memos;
    }



    //notları ekleyip eent ile yayınlıyacak 
    function buyCoffee(string memory _name , string memory _message) public payable {
        // gönderilen deger 0 ise kahve alamaz 
        require(msg.value > 0 , " cant buy coffee for free  ");

        // kahveyi alanın notunun eklenmesi 
        memos.push(Memo(
            msg.sender, 
            block.timestamp, 
            _name,
            _message 
        ));

        // eklenen notun log olarak yayınlanması 
        emit NewMemo(
            msg.sender, 
            block.timestamp, 
            _name, 
            _message
        );

    }
    // eth çekme 
    function withdrawTips() public{
        require(owner.send(address(this).balance));
        // sadece kont. yazan eth çekebilir
    }

    
}