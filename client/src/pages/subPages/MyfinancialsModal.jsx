import React from "react";

const Modal = ({ isOpen, onClose, repaymentTerms }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto transition-transform transform scale-100">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          Repayment Terms
        </h3>
        <p className="text-gray-700 mb-6">{repaymentTerms}</p>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
