// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Escrow {

	address public depositor;
    address public beneficiary;
    address public arbiter;
    bool public isApproved;
    bool public isRefunded;

	event Approved(uint _amount);
    event Deposited(uint _amount);
    event Refunded(uint _amount);
    event ArbiterChanged(address _newArbiter);

	constructor(address _arbiter, address _beneficiary) payable {
		arbiter = _arbiter;
		beneficiary = _beneficiary;
		depositor = msg.sender;
	}

	function approve() public {
		require(msg.sender == arbiter);
		require(!isApproved, "Already approved");
		uint balance = address(this).balance;
		(bool sent, ) = payable(beneficiary).call{value: balance}("");
 		require(sent, "Failed to send Ether");
		
		isApproved = true;

		emit Approved(balance);
	}

	function refund() public {
		require( msg.sender == arbiter, "Only arbiter can initiate a refund.");
        require(!isApproved, "Funds already approved for release");
        
        uint balance = address(this).balance;
        (bool sent, ) = payable(depositor).call{ value: balance }("");
        require(sent, "Failed to send funds");
		isRefunded = true;
        
        emit Refunded(balance);
    }

	function changeArbiter(address _newArbiter) external {

        require(
			msg.sender == depositor, 
			"Only depositor can propose a new arbiter"
		);

        require(
			_newArbiter != address(0), 
			"Invalid arbiter address"
		);
        
        arbiter = _newArbiter;

        emit ArbiterChanged(_newArbiter);
    }

}
