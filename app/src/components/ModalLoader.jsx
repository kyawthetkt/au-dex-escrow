import React from "react";

const ModalLoader = ({ message }) => {
  return (
    <div
      id="loading-modal"
      className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-900"
    >
      <div className="bg-white p-4 rounded-lg shadow-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="text-gray-700 mt-4 text-center">
          {message ?? "Please wait.it will close automatically."}
        </p>
      </div>
    </div>
  );
};

export default ModalLoader;
