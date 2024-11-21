import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import * as XLSX from "xlsx";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Profit = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [formData, setFormData] = useState({
    Department: "",
    Date: "",
    Revenue: "",
    COGS: "",
    OperatingExpenses: "",
    GrossProfit: "",
    NetProfit: "",
    ProfitMargin: "",
  });

  const [rowToUpdate, setRowToUpdate] = useState(null);

  useEffect(() => {
    // Fetch data from the backend API
    axios
      .get(`http://localhost:4000/employees/profit`) // Changed endpoint to "profit"
      .then((response) => {
        setData(response.data);
        setFilteredData(response.data);

        // Extract unique departments for the dropdown
        const uniqueDepartments = [
          "All",
          ...new Set(response.data.map((row) => row.Department)),
        ];
        setDepartments(uniqueDepartments);
      })
      .catch((error) => {
        console.error("Error fetching profit data:", error);
      });
  }, []);

  // Filter data based on the selected department
  const handleDepartmentChange = (event) => {
    const selected = event.target.value;
    setSelectedDepartment(selected);

    if (selected === "All") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((row) => row.Department === selected);
      setFilteredData(filtered);
    }
  };

  // Prepare data for the Line chart
  const chartData = {
    labels: filteredData.map((row) => row.Date),
    datasets: [
      {
        label: "Net Profit", // Changed label to "Net Profit"
        data: filteredData.map((row) => row["Net Profit"]),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
      {
        label: "Profit Target", // Changed label to "Profit Target"
        data: filteredData.map((row) => row["Profit Target"]),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ],
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const {
      Department,
      Date,
      Revenue,
      COGS,
      OperatingExpenses,
      GrossProfit,
      NetProfit,
      ProfitMargin,
    } = formData;

    if (
      !Department ||
      !Date ||
      !Revenue ||
      !COGS ||
      !OperatingExpenses ||
      !GrossProfit ||
      !NetProfit ||
      !ProfitMargin
    ) {
      alert("Please fill out all fields before submitting.");
      return;
    }
    // Adjust form data keys to match backend expectations
    const adjustedFormData = {
      Department: formData.Department,
      Date: formData.Date,
      Revenue: formData.Revenue,
      COGS: formData.COGS,
      OperatingExpenses: formData.OperatingExpenses,
      GrossProfit: formData.GrossProfit,
      NetProfit: formData.NetProfit,
      ProfitMargin: parseFloat(formData.ProfitMargin),
    };

    // Send POST request to insert new data into the backend
    axios
      .post(`http://localhost:4000/employees/profit`, adjustedFormData)
      .then((response) => {
        // After successfully adding the row, refresh the data
        setData([...data, response.data]);
        setFilteredData([...filteredData, response.data]);
        // Show success alert
        alert("Profit data inserted successfully!");
        // Clear form after submission
        setFormData({
          Department: "",
          Date: "",
          Revenue: "",
          COGS: "",
          OperatingExpenses: "",
          GrossProfit: "",
          NetProfit: "",
          ProfitMargin: "",
        });
      })
      .catch((error) => {
        console.error("Error inserting data:", error);
      });
  };

  // Update the most recent row of the selected department
  const updateMostRecentRow = (department) => {
    if (department === "All") {
      alert("Please select a department to update.");
      return;
    }

    // Filter rows for the selected department
    const departmentData = data.filter((row) => row.Department === department);

    if (departmentData.length === 0) {
      alert("No data available for this department.");
      return;
    }

    // Find the most recent row (latest date)
    const mostRecentRow = departmentData.sort(
      (a, b) => new Date(b.Date) - new Date(a.Date)
    )[0]; // Take the first one, which is the most recent

    setRowToUpdate(mostRecentRow);
  };

  // Handle the update form submission
  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    // Check if all necessary fields are filled out
    if (
      !rowToUpdate.Department ||
      !rowToUpdate.Date ||
      !rowToUpdate.Revenue ||
      !rowToUpdate.COGS ||
      !rowToUpdate.OperatingExpenses ||
      !rowToUpdate.GrossProfit ||
      !rowToUpdate.NetProfit ||
      !rowToUpdate.ProfitMargin
    ) {
      alert("Please fill in all fields before updating.");
      return;
    }

    // Send PUT request to update the row in the backend using Department and Date
    axios
      .put(
        `http://localhost:4000/employees/profit/${rowToUpdate.Department}/${rowToUpdate.Date}`, // Changed endpoint to "profit"
        rowToUpdate
      )
      .then((response) => {
        // After the update, modify the data state and re-filter based on selected department
        const updatedData = data.map((row) =>
          row.Department === rowToUpdate.Department &&
          row.Date === rowToUpdate.Date
            ? rowToUpdate
            : row
        );
        setData(updatedData);

        // Filter the updated data based on the selected department
        if (
          selectedDepartment === "All" ||
          selectedDepartment === rowToUpdate.Department
        ) {
          const updatedFilteredData = updatedData.filter(
            (row) =>
              row.Department === selectedDepartment ||
              selectedDepartment === "All"
          );
          setFilteredData(updatedFilteredData);
        }

        // Show success alert
        alert("Profit data updated successfully!");

        // Clear form after update
        setRowToUpdate(null);
      })
      .catch((error) => {
        console.error("Error updating row:", error);
        alert("Error updating profit data. Please try again.");
      });
  };

  // Handle changes in the update form
  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setRowToUpdate({
      ...rowToUpdate,
      [name]: value,
    });
  };

  // Handle Export to Excel
  const handleExportExcel = () => {
    // Prepare the data in a format suitable for XLSX
    const exportData = filteredData.map((row) => ({
      Department: row.Department,
      Date: row.Date,
      "Product Sales": row["Product Sales"],
      "Service Income": row["Service Income"],
      Discounts: row.Discounts,
      "Net Profit": row["Net Profit"], // Changed to "Net Profit"
      "Profit Target": row["Profit Target"], // Changed to "Profit Target"
      Variance: row.Variance,
    }));

    // Create a new workbook
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Profit Data");

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, "profit_data.xlsx");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Profit Details
      </h1>

      {/* Department Filter */}
      <div className="mb-4 text-center">
        <label htmlFor="department" className="mr-2 text-lg font-medium">
          Select Department:
        </label>
        <select
          id="department"
          value={selectedDepartment}
          onChange={handleDepartmentChange}
          className="border border-gray-300 rounded-md px-4 py-2"
        >
          {departments.map((dept, index) => (
            <option key={index} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end p-4">
        {/* Export to Excel button */}
        <button
          onClick={handleExportExcel}
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Export to Excel
        </button>
      </div>

      {/* Line Chart */}
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-4 text-center">
          Net Profit and Profit Target over Time
        </h2>
        <Line data={chartData} />
      </div>

      {/* Add Profit Data Form */}
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-4">Add Profit Data</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium mb-2"
              >
                Department
              </label>
              <input
                type="text"
                name="Department"
                value={formData.Department}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-2">
                Date
              </label>
              <input
                type="date"
                name="Date"
                value={formData.Date}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="revenue"
                className="block text-sm font-medium mb-2"
              >
                Revenue
              </label>
              <input
                type="number"
                name="Revenue"
                value={formData.Revenue}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="cogs" className="block text-sm font-medium mb-2">
                Cost of Goods Sold (COGS)
              </label>
              <input
                type="number"
                name="COGS"
                value={formData.COGS}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="operatingExpenses"
                className="block text-sm font-medium mb-2"
              >
                Operating Expenses
              </label>
              <input
                type="number"
                name="OperatingExpenses"
                value={formData.OperatingExpenses}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
              />
            </div>
            <div>
              <label
                htmlFor="grossProfit"
                className="block text-sm font-medium mb-2"
              >
                Gross Profit
              </label>
              <input
                type="number"
                name="GrossProfit"
                value={formData.GrossProfit}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="netProfit"
                className="block text-sm font-medium mb-2"
              >
                Net Profit
              </label>
              <input
                type="number"
                name="NetProfit"
                value={formData.NetProfit}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
              />
            </div>
            <div>
              <label>Profit Margin:</label>
              <input
                type="text" // Allow both text and numbers
                name="ProfitMargin"
                id="ProfitMargin"
                value={formData.ProfitMargin}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-4 py-2"
              />
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Data
            </button>
          </div>
        </form>
      </div>

      {/* Update Profit Data */}
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-4">Update Profit Data</h2>
        <div className="text-center">
          <button
            onClick={() => updateMostRecentRow(selectedDepartment)}
            className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Update Most Recent Row
          </button>
        </div>
        {rowToUpdate && (
          <form onSubmit={handleUpdateSubmit} className="mt-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium mb-2"
                >
                  Date
                </label>
                <input
                  type="date"
                  name="Date"
                  value={rowToUpdate.Date}
                  onChange={handleUpdateInputChange}
                  className="border border-gray-300 rounded-md px-4 py-2 w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="revenue"
                  className="block text-sm font-medium mb-2"
                >
                  Revenue
                </label>
                <input
                  type="number"
                  name="Revenue"
                  value={rowToUpdate.Revenue}
                  onChange={handleUpdateInputChange}
                  className="border border-gray-300 rounded-md px-4 py-2 w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="cogs"
                  className="block text-sm font-medium mb-2"
                >
                  Cost of Goods Sold (COGS)
                </label>
                <input
                  type="number"
                  name="COGS"
                  value={rowToUpdate.COGS}
                  onChange={handleUpdateInputChange}
                  className="border border-gray-300 rounded-md px-4 py-2 w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="operatingExpenses"
                  className="block text-sm font-medium mb-2"
                >
                  Operating Expenses
                </label>
                <input
                  type="number"
                  name="OperatingExpenses"
                  value={rowToUpdate.OperatingExpenses}
                  onChange={handleUpdateInputChange}
                  className="border border-gray-300 rounded-md px-4 py-2 w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="grossProfit"
                  className="block text-sm font-medium mb-2"
                >
                  Gross Profit
                </label>
                <input
                  type="number"
                  name="GrossProfit"
                  value={rowToUpdate.GrossProfit}
                  onChange={handleUpdateInputChange}
                  className="border border-gray-300 rounded-md px-4 py-2 w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="netProfit"
                  className="block text-sm font-medium mb-2"
                >
                  Net Profit
                </label>
                <input
                  type="number"
                  name="NetProfit"
                  value={rowToUpdate.NetProfit}
                  onChange={handleUpdateInputChange}
                  className="border border-gray-300 rounded-md px-4 py-2 w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="profitMargin"
                  className="block text-sm font-medium mb-2"
                >
                  Profit Margin
                </label>
                <input
                  type="text"
                  name="ProfitMargin"
                  value={rowToUpdate.ProfitMargin}
                  onChange={handleUpdateInputChange}
                  className="border border-gray-300 rounded-md px-4 py-2 w-full"
                />
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Data
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profit;
