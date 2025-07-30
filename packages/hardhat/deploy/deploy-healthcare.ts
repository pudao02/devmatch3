import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployHealthcareAI: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("HealthcareAI", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true, // speed up deployment on local network
  });
};

export default deployHealthcareAI;
deployHealthcareAI.tags = ["HealthcareAI"];