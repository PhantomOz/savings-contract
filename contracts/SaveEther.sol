// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SaveEther {
    mapping(address => uint256) savings;

    event SavingSuccessful(address indexed user, uint256 indexed amount);

    function deposit() external payable {
        require(msg.sender != address(0), "wrong EOA");
        require(msg.value > 0, "can't save zero value");
        savings[msg.sender] = savings[msg.sender] + msg.value;
        emit SavingSuccessful(msg.sender, msg.value);
    }
    function withdraw() external {
        require(msg.sender != address(0), "wrong EOA");
        uint256 _userSavings = savings[msg.sender];
        require(_userSavings > 0, "you don't have any savings");

        savings[msg.sender] -= _userSavings;

        payable(msg.sender).transfer(_userSavings);
    }

    function checkSavings(address _user) external view returns (uint256) {
        return savings[_user];
    }

    function sendOutSaving(address _receiver, uint256 _amount) external {
        require(msg.sender != address(0), "no zero address call");
        require(_amount > 0, "can't send zero value");
        require(savings[msg.sender] >= _amount);
        savings[msg.sender] -= _amount;

        payable(_receiver).transfer(_amount);
    }
    function checkContractBal() external view returns (uint256) {
        return address(this).balance;
    }
}
