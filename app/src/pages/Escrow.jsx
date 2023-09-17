export default function Escrow({
  index,
  isApproved,
  isRefunded,
  address,
  depositor,
  arbiter,
  beneficiary,
  value,
  remark,
  connectedAddress,
  handleApprove,
  handleRefund,
  handleChangeArbiter,
  updateNewArbiter,
  newArbiter
}) {
  return (
    <div className="existing-contract bg-white p-4 rounded-lg shadow-md mb-5">
      <ul className="fields space-y-4">
        <li className="flex justify-between">
          <div className="text-gray-600">Contract Address</div>
          <div className="text-blue font-300"><a target="_blank" rel="noreferrer" href={`https://mumbai.polygonscan.com/address/${address}`}>{address}</a></div>
        </li>
        <li className="flex justify-between">
          <div className="text-gray-600">Arbiter</div>
          <div className="text-black font-300">{arbiter}</div>
        </li>
        <li className="flex justify-between">
          <div className="text-gray-600">Beneficiary</div>
          <div className="text-black font-300">{beneficiary}</div>
        </li>
        <li className="flex justify-between">
          <div className="text-gray-600">Amount</div>
          <div className="text-black font-300">{value} MATIC</div>
        </li>
        <li className="flex justify-between">
          <div className="text-gray-600">Remark</div>
          <div className="text-black font-300">{remark ?? "-"}</div>
        </li> 
        <li className="flex justify-end">
          {isApproved === true && (
            <span className="text-green-500 text-xl font-semibold">
              ✓ It's been approved!
            </span>
          )}
           {isRefunded === true && (
            <span className="text-red-500 text-xl font-semibold">
              ✓ It's been refunded!
            </span>
          )}
          { (isApproved === false && isRefunded === false)  && connectedAddress === arbiter.toLowerCase() && (
            <>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md w-24"
              id={address}
              onClick={(e) => {
                e.preventDefault();
                handleApprove(index, address);
              }}
            >
              Approve 
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md w-24 ml-1"
              id={address}
              onClick={(e) => {
                e.preventDefault();
                handleRefund(index, address);
              }}
            >
              Refund
            </button>
            </>
          )}
           { (isApproved === false && isRefunded === false)  && depositor && connectedAddress === depositor.toLowerCase() && (
           <>
            <div className="mb-4">
            
            <input
              type="text"
              id="arbiter"
              className="mt-1 block w-full border border-indigo-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-400 text-sm" // Added text-sm for smaller font
              value={newArbiter}
              onChange={(event) => updateNewArbiter(event.target.value)}
            />
          </div>
            <button
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-md w-24"
              id={address}
              onClick={(e) => {
                e.preventDefault();
                handleChangeArbiter(index, address, arbiter);
              }}
            >
              Change Arbiter 
            </button> 
            </>
          )}
        </li>
      </ul>
    </div>
  );
}
