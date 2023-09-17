import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import ModalLoader from "../components/ModalLoader";

import deploy from "../deploy";
import LocalStorageDb from "../storage";

let provider = new ethers.providers.Web3Provider(window.ethereum);

function CreateEscrow() {
  const navigate = useNavigate();
  const [account, setAccount] = useState("");
  const [remark, setRemark] = useState("");
  const [signer, setSigner] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");

  const [arbiter, setArbiter] = useState(
    "0x009af9C65c3fE1900E524465733edc0B1DC91AC7"
  );
  const [beneficiary, setBeneficiary] = useState(
    "0x3E29B6aC17aA127009B4956457F7aeA221158453"
  );

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  async function newContract() {
    const amount = value
      ? ethers.utils.parseUnits(value.toString(), "ether")
      : "";
    if (!beneficiary || !arbiter || !amount) {
      alert("Fill all the fields!");
      return;
    }

    setIsLoading(true);

    try {
      const escrowContract = await deploy(signer, arbiter, beneficiary, amount);

      await LocalStorageDb.add({
        address: escrowContract.address,
        arbiter,
        beneficiary,
        depositor: account,
        value: value.toString(),
        remark,
        isApproved: false,
        isRefunded: false
      });
      navigate('/')
    } catch (error) {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-8">
      {isLoading ? <ModalLoader message={"Deploying your escrow..."} /> : null}
      <div className="max-w-md mx-auto">
        <p className="text-lg font-semibold mb-2">Create a New Contract</p>

        <form className="bg-white p-6 shadow-md rounded-lg max-w-md mx-auto">
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="arbiter"
            >
              Arbiter Address <span className="text-red-500">* REQUIRED</span>
            </label>
            <input
              type="text"
              id="arbiter"
              className="mt-1 block w-full border border-indigo-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-400 text-sm" // Added text-sm for smaller font
              value={arbiter}
              onChange={(event) => setArbiter(event.target.value)}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="beneficiary"
            >
              Beneficiary Address{" "}
              <span className="text-red-500">* REQUIRED</span>
            </label>
            <input
              type="text"
              id="beneficiary"
              className="mt-1 block w-full border border-indigo-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-400 text-sm" // Added text-sm for smaller font
              value={beneficiary}
              onChange={(event) => setBeneficiary(event.target.value)}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="metic"
            >
              Deposit Amount (MATIC){" "}
              <span className="text-red-500">* REQUIRED</span>
            </label>
            <input
              type="text"
              id="matic"
              placeholder="Example: 0.1 MATIC"
              className="mt-1 block w-full border border-indigo-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-400 text-sm" // Added text-sm for smaller font
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="remark"
            >
              Remark
            </label>
            <textarea
              type="text"
              id="remark"
              className="mt-1 block w-full border border-indigo-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-400 text-sm" // Added text-sm for smaller font
              onChange={(event) => setRemark(event.target.value)}
              value={remark} // Move the value inside the textarea tags
            ></textarea>
          </div>

          <button
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md w-full"
            onClick={(e) => {
              e.preventDefault();
              newContract();
            }}
          >
            Deploy
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEscrow;
