import { Button, Divider, Input } from "antd";
import React, { useState, useEffect } from "react";
import { useContractReader } from "eth-hooks";

export default function LilENS({ tx, readContracts, writeContracts }) {
  const [queriedAddress, setQueriedAddress] = useState("");
  const [currentOwner, setCurrentOwner] = useState("");
  const [addressToRegister, setAddressToRegister] = useState("");
  const [addressToUpdate, setAddressToUpdate] = useState("");
  const [newOwner, setNewOwner] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (!readContracts.LilENS) return;
      const owner = await readContracts.LilENS.lookup(queriedAddress);
      setCurrentOwner(owner);
    }
    fetchData();
  }, [queriedAddress, readContracts.LilENS]);

  const owner = useContractReader(readContracts, "LilENS", "lookup", [queriedAddress]);

  useEffect(() => {
    setCurrentOwner(owner);
  }, [owner]);

  function register() {
    return tx(writeContracts.LilENS.register(addressToRegister), update => {
      console.log("📡 Transaction Update:", update);
      if (update && (update.status === "confirmed" || update.status === 1)) {
        console.log(" 🍾 Transaction " + update.hash + " finished!");
        console.log(
          " ⛽️ " +
            update.gasUsed +
            "/" +
            (update.gasLimit || update.gas) +
            " @ " +
            parseFloat(update.gasPrice) / 1000000000 +
            " gwei",
        );
      }
    });
  }

  function update() {
    return tx(writeContracts.LilENS.update(addressToUpdate, newOwner), update => {
      console.log("📡 Transaction Update:", update);
      if (update && (update.status === "confirmed" || update.status === 1)) {
        console.log(" 🍾 Transaction " + update.hash + " finished!");
        console.log(
          " ⛽️ " +
            update.gasUsed +
            "/" +
            (update.gasLimit || update.gas) +
            " @ " +
            parseFloat(update.gasPrice) / 1000000000 +
            " gwei",
        );
      }
    });
  }

  return (
    <div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 600, margin: "auto", marginTop: 64 }}>
        <h2>LilENS @ Scroll</h2>
        <Divider />
        <div style={{ margin: 8 }}>
          <Input placeholder="ENS name" onChange={e => setQueriedAddress(e.target.value)} />
          <h4 style={{ marginTop: 8 }}>Current owner: {currentOwner}</h4>
        </div>
        <Divider />

        {/* ------------------------------------------ */}

        <div style={{ margin: 8 }}>
          <Input placeholder="ENS name" onChange={e => setAddressToRegister(e.target.value)} />
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              const result = register();
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
            }}
          >
            Register
          </Button>
        </div>
        <Divider />

        {/* ------------------------------------------ */}

        <div style={{ margin: 8 }}>
          <div style={{ display: "flex" }}>
            <Input placeholder="ENS name" onChange={e => setAddressToUpdate(e.target.value)} />
            <Input placeholder="New owner" onChange={e => setNewOwner(e.target.value)} />
          </div>
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              const result = update();
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
            }}
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
}
