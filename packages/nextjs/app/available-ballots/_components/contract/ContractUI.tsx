"use client";

// @refresh reset
import { useState, useReducer } from "react";
// @ts-ignore
import { Address, Balance } from "~~/components/scaffold-eth";
// @ts-ignore
import { useDeployedContractInfo, useNetworkColor, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
// @ts-ignore
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
// @ts-ignore
import { ContractName } from "~~/utils/scaffold-eth/contract";
import { parseEther } from "viem/utils";

type ContractUIProps = {
  contractName: ContractName;
  className?: string;
};

/**
 * UI component to interface with deployed contracts.
 **/
export const ContractUI = ({ contractName, className = "" }: ContractUIProps) => {
  const { targetNetwork } = useTargetNetwork();
  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo({ contractName: "VotingContract" });
  const networkColor = useNetworkColor();

  const [votingName, setVotingName] = useState<string>("");
  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract({ contractName: "VotingContract" });

  const { data: elections } = useScaffoldReadContract({
    contractName: "VotingContract",
    functionName: "getElections",
    // args: []
  });

  const handleVotingNameChange = (event: any) => {
    setVotingName(event.target.value);
  }

  if (deployedContractLoading) {
    return (
      <div className="mt-14">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!deployedContractData) {
    return (
      <p className="text-3xl mt-14">
        {`No contract found by the name of "${contractName}" on chain "${targetNetwork.name}"!`}
      </p>
    );
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-6 px-6 lg:px-10 lg:gap-12 w-full max-w-7xl my-0 ${className}`}>
      <div className="col-span-5 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        
        <div className="col-span-1 flex flex-col">
          <div className="bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-6 lg:px-8 mb-6 space-y-1 py-4">
            <div className="flex">
              <div className="flex flex-col gap-1">
                <span className="font-bold">{contractName}</span>
                <Address address={deployedContractData.address} onlyEnsOrAddress />
                <div className="flex gap-1 items-center">
                  <span className="font-bold text-sm">Balance:</span>
                  <Balance address={deployedContractData.address} className="px-0 h-1.5 min-h-[0.375rem]" />
                </div>
              </div>
            </div>
            {targetNetwork && (
              <p className="my-0 text-sm">
                <span className="font-bold">Network</span>:{" "}
                <span style={{ color: networkColor }}>{targetNetwork.name}</span>
              </p>
            )}
          </div>
          {/* <div className="bg-base-300 rounded-3xl px-6 lg:px-8 py-4 shadow-lg shadow-base-300">
            <ContractVariables
              refreshDisplayVariables={refreshDisplayVariables}
              deployedContractData={deployedContractData}
            />
          </div> */}
        </div>
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          <div className="p-5 divide-y divide-base-300 flex flex-col gap-5" style={{ backgroundColor: "#385183", borderRadius: "20px" }}>
            <span style={{}}>Create vote</span>
            <input 
              className="input input-ghost focus-within:border-transparent focus:outline-none focus:bg-transparent h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/70 text-base-content/70 focus:text-base-content/70" 
              placeholder="Name vote"
              onChange={handleVotingNameChange}
              name="userGreetingCounter_input_0__address_address"
              style={{background: "rgb(43 55 88)"}}
            />
            <button 
              className="btn btn-secondary btn-sm self-end md:self-start" 
              style={{ marginLeft: 'auto' }}
              onClick={async () => {
                try {
                  await writeYourContractAsync({
                    functionName: "addVoting",
                    args: [votingName],
                    value: parseEther("0.01"),
                  });
                } catch (e) {
                  console.error(e);
                }
              }}
            >
                create
            </button>
          </div>

          {elections && 
            elections[0].map((item: string, index: number) => (
              <div key={index}>
                { elections[1][index] &&
                  <div className="p-5 flex flex-col gap-2" style={{ backgroundColor: "#385183", borderRadius: "20px" }}>
                  <span style={{}}>{item}</span>
  
                  <ul style={{ margin: '0 0 10px 0' }}>
                    <li>IsComplete: {elections[2][index] ? "True" : "False"}</li>
                    <li>{ elections[2][index] && <span>Winner: {elections[3][index]}</span>}</li>
                  </ul>
  
                  <div className="flex gap-2 flex-row" style={{ justifyContent: 'space-between' }}>
                    <div className="flex gap-2">
                      <a className="btn btn-secondary btn-sm self-end md:self-start" href={`/ballot/${index}`}>details</a>
                      {/* <button className="btn btn-secondary btn-sm self-end md:self-start">vote</button>
                      <button className="btn btn-secondary btn-sm self-end md:self-start">cancel vote</button> */}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        className="btn btn-secondary btn-sm self-end md:self-start"
                        onClick={async () => {
                          try {
                            await writeYourContractAsync({
                              functionName: "completeElection",
                              args: [index]
                            });
                          } catch (e) {
                            console.error(e);
                          }
                        }}>
                        complete
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm self-end md:self-start"
                        onClick={async () => {
                          try {
                            await writeYourContractAsync({
                              functionName: "deleteElection",
                              args: [index]
                            });
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                      >
                        delete
                      </button>
                    </div>
                  </div>
                </div>
                }
              </div>
            ))
          }
        </div>

      </div>
    </div>
  );
};
