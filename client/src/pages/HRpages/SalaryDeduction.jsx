import React, { useState } from "react";

const SalaryDeduction = () => {
  const [taxes, setTaxes] = useState([]);
  const [employeeDeductions, setEmployeeDeductions] = useState([]);
  const [taxFormData, setTaxFormData] = useState({
    taxName: "",
    rate: "",
  });
  const [deductionFormData, setDeductionFormData] = useState({
    employeeName: "",
    deductionAmount: "",
  });
  const [editingTax, setEditingTax] = useState(null);
  const [editingDeduction, setEditingDeduction] = useState(null);

  // Handle form data change
  const handleTaxInputChange = (e) => {
    setTaxFormData({ ...taxFormData, [e.target.name]: e.target.value });
  };

  const handleDeductionInputChange = (e) => {
    setDeductionFormData({
      ...deductionFormData,
      [e.target.name]: e.target.value,
    });
  };

  // CRUD Operations for Tax
  const addTax = () => {
    setTaxes([...taxes, { id: Date.now(), ...taxFormData }]);
    setTaxFormData({ taxName: "", rate: "" });
  };

  const editTax = (tax) => {
    setTaxFormData(tax);
    setEditingTax(tax.id);
  };

  const updateTax = () => {
    setTaxes(
      taxes.map((tax) =>
        tax.id === editingTax ? { ...tax, ...taxFormData } : tax
      )
    );
    setTaxFormData({ taxName: "", rate: "" });
    setEditingTax(null);
  };

  const deleteTax = (id) => {
    setTaxes(taxes.filter((tax) => tax.id !== id));
  };

  // CRUD Operations for Employee Deduction
  const addDeduction = () => {
    setEmployeeDeductions([
      ...employeeDeductions,
      { id: Date.now(), ...deductionFormData },
    ]);
    setDeductionFormData({ employeeName: "", deductionAmount: "" });
  };

  const editDeduction = (deduction) => {
    setDeductionFormData(deduction);
    setEditingDeduction(deduction.id);
  };

  const updateDeduction = () => {
    setEmployeeDeductions(
      employeeDeductions.map((deduction) =>
        deduction.id === editingDeduction
          ? { ...deduction, ...deductionFormData }
          : deduction
      )
    );
    setDeductionFormData({ employeeName: "", deductionAmount: "" });
    setEditingDeduction(null);
  };

  const deleteDeduction = (id) => {
    setEmployeeDeductions(
      employeeDeductions.filter((deduction) => deduction.id !== id)
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-8">
        Tax and Employee Deduction Management
      </h1>

      {/* Tax Management Section */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Tax Management</h2>

        <div className="mb-6">
          <input
            className="border border-gray-300 rounded-lg p-2 w-full mb-2"
            type="text"
            name="taxName"
            value={taxFormData.taxName}
            onChange={handleTaxInputChange}
            placeholder="Tax Name"
          />
          <input
            className="border border-gray-300 rounded-lg p-2 w-full mb-2"
            type="number"
            name="rate"
            value={taxFormData.rate}
            onChange={handleTaxInputChange}
            placeholder="Tax Rate (%)"
          />
          {editingTax ? (
            <button
              className="bg-blue-500 text-white rounded-lg px-6 py-2 w-full hover:bg-blue-600"
              onClick={updateTax}
            >
              Update Tax
            </button>
          ) : (
            <button
              className="bg-green-500 text-white rounded-lg px-6 py-2 w-full hover:bg-green-600"
              onClick={addTax}
            >
              Add Tax
            </button>
          )}
        </div>

        <table className="w-full table-auto border-collapse mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Tax Name</th>
              <th className="border border-gray-300 p-2">Rate (%)</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {taxes.map((tax) => (
              <tr key={tax.id} className="even:bg-gray-50">
                <td className="border border-gray-300 p-2">{tax.taxName}</td>
                <td className="border border-gray-300 p-2">{tax.rate}</td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    className="bg-yellow-400 text-white px-3 py-1 mr-2 rounded-lg hover:bg-yellow-500"
                    onClick={() => editTax(tax)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                    onClick={() => deleteTax(tax.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Employee Deduction Management Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Employee Deduction Management
        </h2>

        <div className="mb-6">
          <input
            className="border border-gray-300 rounded-lg p-2 w-full mb-2"
            type="text"
            name="employeeName"
            value={deductionFormData.employeeName}
            onChange={handleDeductionInputChange}
            placeholder="Employee Name"
          />
          <input
            className="border border-gray-300 rounded-lg p-2 w-full mb-2"
            type="number"
            name="deductionAmount"
            value={deductionFormData.deductionAmount}
            onChange={handleDeductionInputChange}
            placeholder="Deduction Amount"
          />
          {editingDeduction ? (
            <button
              className="bg-blue-500 text-white rounded-lg px-6 py-2 w-full hover:bg-blue-600"
              onClick={updateDeduction}
            >
              Update Deduction
            </button>
          ) : (
            <button
              className="bg-green-500 text-white rounded-lg px-6 py-2 w-full hover:bg-green-600"
              onClick={addDeduction}
            >
              Add Deduction
            </button>
          )}
        </div>

        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Employee Name</th>
              <th className="border border-gray-300 p-2">Deduction Amount</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employeeDeductions.map((deduction) => (
              <tr key={deduction.id} className="even:bg-gray-50">
                <td className="border border-gray-300 p-2">
                  {deduction.employeeName}
                </td>
                <td className="border border-gray-300 p-2">
                  {deduction.deductionAmount}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    className="bg-yellow-400 text-white px-3 py-1 mr-2 rounded-lg hover:bg-yellow-500"
                    onClick={() => editDeduction(deduction)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                    onClick={() => deleteDeduction(deduction.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryDeduction;
