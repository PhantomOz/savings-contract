import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SaveEther", function () {
  async function deploySaveEther() {
    const [owner, otherAccount] = await ethers.getSigners();

    const SaveEther = await ethers.getContractFactory("SaveEther");
    const saveEther = await SaveEther.deploy();

    return { saveEther, owner, otherAccount };
  }
  describe("Deposit", function () {
    it("Should throw an error if value is not greater than zero", async function(){
        const {saveEther} = await loadFixture(deploySaveEther);
        await expect(saveEther.deposit({value: 0})).to.be.revertedWith(`can't save zero value`);
    });
    it("Should succesfully deposit funds", async function(){
        const {saveEther, owner} = await loadFixture(deploySaveEther);
        await saveEther.deposit({value: 1});
        await expect( await saveEther.checkSavings(owner)).to.be.equal(1);
        await expect(await saveEther.checkContractBal()).to.be.equals(1);
    });
    it("Should Emit SavingSuccessful event after deposit", async function(){
        const {saveEther, owner} = await loadFixture(deploySaveEther);
        await expect(await saveEther.deposit({value: 1})).to.emit(saveEther, "SavingSuccessful").withArgs(owner, 1);
    });
  });
  describe("Withdraw", function () {
    it("Should throw an error if user does not have savings", async function(){
        const {saveEther} = await loadFixture(deploySaveEther);
        await expect(saveEther.withdraw()).to.be.revertedWith(`you don't have any savings`);
    });
    it("Should succesfully Withdraw", async function(){
        const {saveEther, owner} = await loadFixture(deploySaveEther);
        await saveEther.deposit({value: 50});
        await expect( await saveEther.withdraw()).to.changeEtherBalance(owner, +50);
        await expect(await saveEther.checkContractBal()).to.be.equals(0);
    });
  });
  describe("SendOutSaving", function () {
    it("Should throw an error if amount is not greater than zero", async function(){
        const {saveEther,otherAccount} = await loadFixture(deploySaveEther);
        await expect(saveEther.sendOutSaving(otherAccount, 0)).to.be.revertedWith(`can't send zero value`);
    });
    it("Should throw an error if amount is greater than balance", async function(){
        const {saveEther, otherAccount} = await loadFixture(deploySaveEther);
        await saveEther.deposit({value: 50});
        await expect(saveEther.sendOutSaving(otherAccount, 51)).to.be.reverted;
    });
    it("Should should successfully credit the receiver", async function(){
        const {saveEther, otherAccount} = await loadFixture(deploySaveEther);
        await saveEther.deposit({value: 50});
        await expect( await saveEther.sendOutSaving(otherAccount, 50)).to.changeEtherBalance(otherAccount, +50);
        await expect(await saveEther.checkContractBal()).to.be.equals(0);
    });
  });
});