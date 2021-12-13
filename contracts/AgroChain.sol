pragma solidity ^0.5.0;

contract AgroChain {

    uint256 public s = 1; 
    uint256 public c;
    uint256 public t=1;
    mapping (address => uint) balances;

    function fundaddr(address addr) public{
        balances[addr] = 2000;
    }

    function sendCoin(address receiver, uint amount, address sender) public returns(bool sufficient){
        if (balances[sender] < amount){
            return false;
        }

        balances[sender] -= amount;
        balances[receiver] += amount;
        return true;
    }

    function getBalance(address addr) view public returns(uint){
        return balances[addr];
    }
    struct farmer {
        bytes fid;
        bytes32 fname;
        bytes32 loc;
        bytes32 crop;
        uint256 contact;
        uint quantity;
        uint exprice;
    }

    struct lot {
        bytes lotno;
        bytes grade;
        uint mrp;
        bytes32 testdate;
        bytes32 expdate;
    }

    address public tester;
    address owner;

    mapping (bytes => farmer) idFarmers;
    farmer[] public Farmers;

    mapping (bytes => lot) idLots;
    lot[] public Lots;


    // Make a new farmer
    function Produce(bytes memory id, bytes32 name, bytes32 loc, bytes32 cr, uint256 con, uint q, uint pr) public {
        AgroChain.farmer memory fnew = farmer(id,name,loc,cr,con,q,pr);
        idFarmers[id] = fnew;
        Farmers.push(fnew);
        s++;
    }

    function getProduce() public view returns (uint256 ) {
    return s;
  }

    function getProduceById(bytes memory j) public view returns(bytes memory,bytes32,bytes32,bytes32,uint256,uint,uint) {
        return (idFarmers[j].fid,idFarmers[j].fname,idFarmers[j].loc,idFarmers[j].crop,idFarmers[j].contact,idFarmers[j].quantity,idFarmers[j].exprice);
    }

    function Quality(bytes memory ll, bytes memory g, uint256 p, bytes32 tt, bytes32 e) public {
        AgroChain.lot memory lnew=lot(ll,g,p,tt,e);
        idLots[ll]=lnew;
        Lots.push(lnew);
        t++;
    }

    function getQualityById(bytes memory k) public view returns(bytes memory,bytes memory,uint,bytes32,bytes32) {
        return(idLots[k].lotno,idLots[k].grade,idLots[k].mrp,idLots[k].testdate,idLots[k].expdate);
    }
}
