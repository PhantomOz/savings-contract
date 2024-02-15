import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
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
    });
    it("Should Emit SavingSuccessful event after deposit", async function(){
        const {saveEther, owner} = await loadFixture(deploySaveEther);
        await expect(await saveEther.deposit({value: 1})).to.emit(saveEther, "SavingSuccessful").withArgs(owner, 1);
    });
  });
});