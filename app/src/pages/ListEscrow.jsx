import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Escrow from "./Escrow";
import ModalLoader from "../components/ModalLoader";

import LocalStorageDb from "../storage";
import escrowContractJson from "../artifacts/contracts/Escrow.sol/Escrow";

let provider = new ethers.providers.Web3Provider(window.ethereum);

function ListEscrow() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [newArbiter, setNewArbiter] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  useEffect(() => {
    async function getEscrows() {
      const escrows = await LocalStorageDb.getAll();
      if (escrows) {
        setEscrows(escrows);
      }
    }

    getEscrows();
  }, []);

  function updateNewArbiter(_newAddres) {
    setNewArbiter(_newAddres);
  }

  async function handleApprove(index, contractAddress) {
    const escrowContract = new ethers.Contract(
      contractAddress,
      escrowContractJson.abi,
      provider
    );
    const isApproved = await escrowContract.isApproved();
    const isRefunded = await escrowContract.isRefunded();

    if (isApproved || isRefunded) {
      alert("This escrow has been already approved or refunded.");
    } else {
      try {
        setIsLoading((prev) => !prev);
        const approveTxn = await escrowContract.connect(signer).approve();
        await approveTxn.wait();
        await LocalStorageDb.updateByKey(index, "isApproved", true);
        await LocalStorageDb.updateByKey(index, "isRefunded", false);
        window.location.reload();
      } catch (error) {
        setIsLoading((prev) => !prev);
      }
    }
  }

  async function handleRefund(index, contractAddress) {
    const escrowContract = new ethers.Contract(
      contractAddress,
      escrowContractJson.abi,
      provider
    );
    const isApproved = await escrowContract.isApproved();

    if (isApproved) {
      alert("This escrow has been already approved.");
    } else {
      try {
        setIsLoading((prev) => !prev);
        const approveTxn = await escrowContract.connect(signer).refund();
        await approveTxn.wait();
        await LocalStorageDb.updateByKey(index, "isApproved", false);
        await LocalStorageDb.updateByKey(index, "isRefunded", true);
        window.location.reload();
      } catch (error) {
        setIsLoading((prev) => !prev);
      }
    }
  }

  async function handleChangeArbiter(index, contractAddress, existingArbiter) {

    if ( newArbiter === existingArbiter) {
      alert("Please enter new arbiter address");
      return false;
    }

    const escrowContract = new ethers.Contract(
      contractAddress,
      escrowContractJson.abi,
      provider
    );
    const isApproved = await escrowContract.isApproved();
    const isRefunded = await escrowContract.isRefunded();

    if (isApproved || isRefunded) {
      alert("This escrow has been already approved or refunded.");
    } else {
      try {
        setIsLoading((prev) => !prev);
        const approveTxn = await escrowContract.connect(signer).changeArbiter(newArbiter);
        await approveTxn.wait();
        await LocalStorageDb.updateByKey(index, "arbiter", newArbiter)
        window.location.reload();
      } catch (error) {
        setIsLoading((prev) => !prev);
      }
    }
  }

  return (
    <>
      {isLoading ? <ModalLoader /> : null}
      <h4>
        {" "}
        <Link
          to={`escrow/create`}
          className="text-gray-600 hover:text-gray-900 hover:underline bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block"
        >
          Create Escrow
        </Link>
      </h4>
      <div className="container mx-auto py-8">
        {escrows.map((escrow, index) => {
          return (
            <Escrow
              key={escrow.address}
              {...escrow}
              index={index}
              connectedAddress={account}
              handleApprove={handleApprove}
              handleRefund={handleRefund}
              handleChangeArbiter={handleChangeArbiter}
              updateNewArbiter={updateNewArbiter}
            />
          );
        })}
      </div>
    </>
  );
}

export default ListEscrow;
