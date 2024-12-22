import type { NextPage } from "next";
import { VotingContracts } from "./_components/VotingСontracts";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Debug Contracts",
  description: "Debug your deployed 🏗 Scaffold-ETH 2 contracts in an easy way",
});

const AvailableBallots: NextPage = () => {
  return (
    <>
      <VotingContracts></VotingContracts>
    </>
  );
};

export default AvailableBallots;