"use client";

import { useState } from "react";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function Page({params}: { params: Promise<{ id: string }>}) {
  const id: number = (params)?.id || 1;
  const [votingName, setVotingName] = useState<string>("");
  const [vote, setVote] = useState<number>(0);
  const [proposal, setProposal] = useState<string>("");
  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract({ contractName: "VotingContract" });

  const handleVotingNameChange = (event) => {
    setVotingName(event.target.value);
  }

  const handleVoteChange = (event) => {
    setVote(event.target.value);
    if(event.target.name == "vote"){
      setVote(event.target.value);
   }
  }

  const handleProposalChange = (event) => {
    setProposal(event.target.value);
  }

  const { data: election } = useScaffoldReadContract({
    contractName: "VotingContract",
    functionName: "getElection",
    args: [id]
  });

  return (
    <>
      {/* <div>My Post: {id}</div> */}
      <div style={{ width: "50%", margin: "20px auto" }}>
        <div className="col-span-5 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
            <div className="p-5 divide-y divide-base-300 flex flex-col gap-5" style={{ backgroundColor: "#385183", borderRadius: "20px" }}>
              <span style={{}}>Give right to Vote</span>
              <input 
                className="input input-ghost focus-within:border-transparent focus:outline-none focus:bg-transparent h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/70 text-base-content/70 focus:text-base-content/70" 
                placeholder="Address"
                name="userGreetingCounter_input_0__address_address"
                style={{background: "rgb(43 55 88)"}}
                onChange={handleVotingNameChange}
              />
              <button 
                className="btn btn-secondary btn-sm self-end md:self-start" 
                style={{ marginLeft: 'auto' }}
                onClick={async () => {
                  try {
                    await writeYourContractAsync({
                      functionName: "addVoter",
                      args: [id, votingName],
                    });
                  } catch (e) {
                    console.error(e);
                  }
                }}
              >
                accept
              </button>
            </div>

            <div className="p-5 flex flex-col gap-2" style={{ backgroundColor: "#385183", borderRadius: "20px" }}>
              <span style={{}}>{election && election[0]}</span>

              <form onChange={handleVoteChange} style={{margin: '10px 0 20px'}}>
                {election && election[1].map((item: string, index: number) => (
                  <div key={index}>
                    <label className="flex gap-2" style={{ alignItems: 'center' }}>
                    <input type="radio" value={index} name="vote" style={{ position: 'relative', top: '0px'}}/>
                    <span style={{ marginRight: '10px'}}>{item}</span>
                    <span>Count: {election[2][index] > 0 ? election[2][index].toString() : 0}</span>
                    </label>
                  </div>
                ))}
                {!election && "Proposals does not exist"} 
              </form>

              <div className="flex gap-2 flex-row" style={{ justifyContent: 'space-between' }}>
                <div className="flex gap-2">
                  <button 
                    className="btn btn-secondary btn-sm self-end md:self-start"
                    onClick={async () => {
                      try {
                        await writeYourContractAsync({
                          functionName: "vote",
                          args: [id, vote],
                        });
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                  >
                    vote
                  </button>
                </div>
                <div className="flex gap-2">
                  <a className="btn btn-secondary btn-sm self-end md:self-start" href="/available-ballots/">back</a>
                </div>
              </div>
            </div>

            <div className="p-5 divide-y divide-base-300 flex flex-col gap-5" style={{ backgroundColor: "#385183", borderRadius: "20px" }}>
              <span style={{}}>Add proposal</span>
              <input 
                className="input input-ghost focus-within:border-transparent focus:outline-none focus:bg-transparent h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/70 text-base-content/70 focus:text-base-content/70" 
                placeholder="Proposal"
                name="proposal"
                style={{background: "rgb(43 55 88)"}}
                onChange={handleProposalChange}
              />
              <button 
                className="btn btn-secondary btn-sm self-end md:self-start" 
                style={{ marginLeft: 'auto' }}
                onClick={async () => {
                  try {
                    await writeYourContractAsync({
                      functionName: "addProposal",
                      args: [id, proposal],
                    });
                  } catch (e) {
                    console.error(e);
                  }
                }}
              >
                accept
              </button>
            </div>
          </div>
      </div>
    </div>
    </>
  );
}
