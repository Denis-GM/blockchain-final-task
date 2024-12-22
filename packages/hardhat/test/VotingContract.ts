import { expect } from "chai";
import { ethers } from "hardhat";
import { VotingContract } from "../typechain-types";
import _ from 'lodash';

// const _ = require('lodash');

describe("VotingContract", function () {

  let votingContract: VotingContract;
  before(async () => {
    const [owner] = await ethers.getSigners();
    const votingContractFactory = await ethers.getContractFactory("VotingContract");
    votingContract = (await votingContractFactory.deploy(owner.address)) as VotingContract;
    await votingContract.waitForDeployment();
  });

  describe("Deployment", function () {

    it("Create a new election", async function () {
      const electionName = "First";

      await votingContract.addVoting(electionName);
      expect(_.isEqual(await votingContract.getElection(0), [electionName, [], []] ));
    });

    it("All elections", async function () {
      expect(_.isEqual(await votingContract.getElections(), [["First"], [true], [false], [""]] ));
    });

    it("Add proposal", async function () {
      await votingContract.addProposal(0, "Первый");
      expect((await votingContract.getProposal(0, 0)).name).to.equal("Первый");
    });

    it("Complete", async function () {
      await votingContract.completeElection(0);
      expect(_.isEqual(await votingContract.getElections(), [["First"], [true], [true], ["Первый"]] ));
    });

    it("Delete", async function () {
      await votingContract.deleteElection(0);
      expect(_.isEqual(await votingContract.getElections(), [["First"], [false], [true], [""]] ));
    });
  });
});
