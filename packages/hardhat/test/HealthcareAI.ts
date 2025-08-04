import { ethers } from "hardhat";
import { expect } from "chai";

describe("HealthcareAI", function () {
  let healthcareAI: any;
  let owner: any;
  let user: any;
  let aiBackend: any;

  beforeEach(async function () {
    [owner, user, aiBackend] = await ethers.getSigners();
    const HealthcareAI = await ethers.getContractFactory("HealthcareAI");
    healthcareAI = await HealthcareAI.deploy();
    await healthcareAI.deployed();
    await healthcareAI.connect(owner).setAIBackend(aiBackend.address);
  });

  it("should allow a user to submit a prompt", async function () {
    await healthcareAI.connect(user).submitPrompt("What is diabetes?");
    const prompts = await healthcareAI.connect(user).getMyPrompts();
    expect(prompts.length).to.equal(1);
    expect(prompts[0].prompt).to.equal("What is diabetes?");
  });

  it("should only allow AI backend to store a response", async function () {
    await healthcareAI.connect(user).submitPrompt("What is diabetes?");
    await expect(
      healthcareAI.connect(user).storeResponse(user.address, "Diabetes is ...")
    ).to.be.revertedWith("Not authorized");
    await healthcareAI.connect(aiBackend).storeResponse(user.address, "Diabetes is ...");
    const responses = await healthcareAI.connect(user).getMyResponses();
    expect(responses.length).to.equal(1);
    expect(responses[0].output).to.equal("Diabetes is ...");
  });

  it("should allow a user to submit feedback", async function () {
    await healthcareAI.connect(user).submitPrompt("What is diabetes?");
    await healthcareAI.connect(aiBackend).storeResponse(user.address, "Diabetes is ...");
    await healthcareAI.connect(user).submitFeedback(0, 5, "Very helpful");
    const feedbacks = await healthcareAI.connect(user).getMyFeedbacks();
    expect(feedbacks.length).to.equal(1);
    expect(feedbacks[0].rating).to.equal(5);
    expect(feedbacks[0].comment).to.equal("Very helpful");
  });
});