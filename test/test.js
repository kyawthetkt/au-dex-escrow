const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Escrow', function () {
  let contract;
  let depositor;
  let beneficiary;
  let arbiter;
  let newArbiter;

  const deposit = ethers.utils.parseEther('1');
  beforeEach(async () => {
    depositor = ethers.provider.getSigner(0);
    beneficiary = ethers.provider.getSigner(1);
    arbiter = ethers.provider.getSigner(2);
    newArbiter = ethers.provider.getSigner(3);

    const Escrow = await ethers.getContractFactory('Escrow');
    contract = await Escrow.deploy(
      arbiter.getAddress(),
      beneficiary.getAddress(),
      {
        value: deposit,
      }
    );
    await contract.deployed();
  });

  it('should be funded initially', async function () {
    let balance = await ethers.provider.getBalance(contract.address);
    expect(balance).to.eq(deposit);
  });

  describe('after approval from address other than the arbiter', () => {
    it('should revert', async () => {
      await expect(contract.connect(beneficiary).approve()).to.be.reverted;
    });
  });

  describe('after approval from the arbiter', () => {
    it('should transfer balance to beneficiary', async () => {
      const before = await ethers.provider.getBalance(beneficiary.getAddress());
      const approveTxn = await contract.connect(arbiter).approve();
      await approveTxn.wait();
      const after = await ethers.provider.getBalance(beneficiary.getAddress());
      expect(after.sub(before)).to.eq(deposit);
    });
  });

  describe('refund', () => {
    it('should allow the arbiter to initiate a refund', async () => {
      const before = await ethers.provider.getBalance(depositor.getAddress());
      await contract.connect(arbiter).refund();
      const after = await ethers.provider.getBalance(depositor.getAddress());
      expect(after.sub(before)).to.eq(deposit);

      const contractBalance = await ethers.provider.getBalance(contract.address);
      expect(contractBalance.toString()).to.eq("0");
    });

    it('should revert if the depositor tries to initiate a refund', async () => {
      await expect(contract.connect(depositor).refund()).to.be.revertedWith('Only arbiter can initiate a refund.');
    });

    it('should revert if the beneficiary tries to initiate a refund', async () => {
      await expect(contract.connect(beneficiary).refund()).to.be.revertedWith('Only arbiter can initiate a refund.');
    });

    it('should revert if funds have already been approved', async () => {
      await contract.connect(arbiter).approve();
      await expect(contract.connect(arbiter).refund()).to.be.revertedWith('Funds already approved for release');
    });
  });

  describe('changeArbiter', () => {
    it('should allow if the depositor to propose a new arbiter', async () => {
      const newArbiterAddress = await newArbiter.getAddress();
      await contract.connect(depositor).changeArbiter(newArbiterAddress);

      const updatedArbiter = await contract.arbiter();
      expect(updatedArbiter).to.equal(newArbiterAddress);
    });

    it('should revert if an invalid arbiter address is proposed', async () => {
      const invalidArbiter = ethers.constants.AddressZero; // Using the zero address as an invalid address
      await expect(contract.connect(depositor).changeArbiter(invalidArbiter)).to.be.revertedWith(
        'Invalid arbiter address'
      );
    });

    it('should revert if a non-depositor tries to change the arbiter', async () => {
      await expect(contract.connect(beneficiary).changeArbiter(newArbiter.getAddress())).to.be.revertedWith(
        'Only depositor can propose a new arbiter'
      );
    });
  });


});
