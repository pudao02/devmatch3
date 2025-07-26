import { task } from "hardhat/config";
//REMEMBER TO CHANGE DIRECTORY TO HARDHAT T0 RUN
task("deploy").setAction(async (_args, hre) => {
  const Vigil = await hre.ethers.getContractFactory("Vigil");
  const vigil = await Vigil.deploy();
  const vigilAddr = await vigil.waitForDeployment();

  console.log(`Vigil address: ${vigilAddr.target}`);
  return vigilAddr.target;
});

task("create-secret")
  .addParam("address", "contract address")
  .setAction(async (args, hre) => {
    const vigil = await hre.ethers.getContractAt("Vigil", args.address);

    const tx = await vigil.createSecret("ingredient", 30 /* seconds */, Buffer.from("brussels sprouts"));
    console.log("Storing a secret in", tx.hash);
  });

task("check-secret")
  .addParam("address", "contract address")
  .setAction(async (args, hre) => {
    const vigil = await hre.ethers.getContractAt("Vigil", args.address);

    try {
      console.log("Checking the secret");
      await vigil.revealSecret(0);
      console.log("Uh oh. The secret was available!");
      process.exit(1);
    } catch (e: any) {
      console.log("failed to fetch secret:", e.message);
    }
    console.log("Waiting...");

    await new Promise(resolve => setTimeout(resolve, 30_000));
    console.log("Checking the secret again");
    const secret = await vigil.revealSecret.staticCallResult(0); // Get the value.
    console.log("The secret ingredient is", Buffer.from(secret[0].slice(2), "hex").toString());
  });

task("full-vigil").setAction(async (_args, hre) => {
  await hre.run("compile");

  // Deploy the contract directly instead of using the deploy task
  const Vigil = await hre.ethers.getContractFactory("Vigil");
  const vigil = await Vigil.deploy();
  const vigilAddr = await vigil.waitForDeployment();
  const address = vigilAddr.target;

  console.log(`Vigil address: ${address}`);

  await hre.run("create-secret", { address: address });
  await hre.run("check-secret", { address: address });
});
