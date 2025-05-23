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

const Revenue = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [formData, setFormData] = useState({
    Department: "",
    Date: "",
    "Product Sales": "",
    "Service Income": "",
    Discounts: "",
    "Net Revenue": "",
    "Revenue Target": "",
    Variance: "",
  });
  const [rowToUpdate, setRowToUpdate] = useState(null);

  useEffect(() => {
    // Fetch data from the backend API
    axios
      .get(`http://localhost:4000/employees/revenue`)
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
        console.error("Error fetching revenue data:", error);
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
        label: "Net Revenue",
        data: filteredData.map((row) => row["Net Revenue"]),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
      {
        label: "Revenue Target",
        data: filteredData.map((row) => row["Revenue Target"]),
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

    // Send POST request to insert new data into the backend
    axios
      .post(`http://localhost:4000/employees/revenue`, formData)
      .then((response) => {
        // After successfully adding the row, refresh the data
        setData([...data, response.data]); // Add the new row to the state
        setFilteredData([...filteredData, response.data]);

        // Clear form after submission
        setFormData({
          Department: "",
          Date: "",
          "Product Sales": "",
          "Service Income": "",
          Discounts: "",
          "Net Revenue": "",
          "Revenue Target": "",
          Variance: "",
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

    // Send PUT request to update the row in the backend using Department and Date
    axios
      .put(
        `http://localhost:4000/employees/revenue/${rowToUpdate.Department}/${rowToUpdate.Date}`,
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

        // Clear form after update
        setRowToUpdate(null);
      })
      .catch((error) => {
        console.error("Error updating row:", error);
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
      "Net Revenue": row["Net Revenue"],
      "Revenue Target": row["Revenue Target"],
      Variance: row.Variance,
    }));

    // Create a new workbook
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Revenue Data");

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, "revenue_data.xlsx");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Revenue Details
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
          Net Revenue and Revenue Target over Time
        </h2>
        <Line data={chartData} />
      </div>

      {/* Insert New Row Form */}
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-4 text-center">
          Add New Revenue Data
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Form Inputs */}
            {Object.keys(formData).map((key) => (
              <div key={key}>
                <label className="block mb-2">{key}</label>
                <input
                  type={key === "Date" ? "date" : "text"}
                  name={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md px-4 py-2 w-full"
                  required
                />
              </div>
            ))}
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-6 rounded-md mt-4"
            >
              Add Row
            </button>
          </div>
        </form>
      </div>

      {/* Conditional Table Rendering */}
      <div className="overflow-x-auto">
        {selectedDepartment !== "All" && (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Department</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Product Sales</th>
                <th className="py-2 px-4 border-b">Service Income</th>
                <th className="py-2 px-4 border-b">Discounts</th>
                <th className="py-2 px-4 border-b">Net Revenue</th>
                <th className="py-2 px-4 border-b">Revenue Target</th>
                <th className="py-2 px-4 border-b">Variance</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">{row.Department}</td>
                  <td className="py-2 px-4 border-b">{row.Date}</td>
                  <td className="py-2 px-4 border-b">{row["Product Sales"]}</td>
                  <td className="py-2 px-4 border-b">
                    {row["Service Income"]}
                  </td>
                  <td className="py-2 px-4 border-b">{row.Discounts}</td>
                  <td className="py-2 px-4 border-b">{row["Net Revenue"]}</td>
                  <td className="py-2 px-4 border-b">
                    {row["Revenue Target"]}
                  </td>
                  <td className="py-2 px-4 border-b">{row.Variance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Update the most recent row for selected department */}
      <div className="mt-6 text-center">
        <button
          onClick={() => updateMostRecentRow(selectedDepartment)}
          className="bg-green-500 text-white py-2 px-6 rounded-md"
        >
          Update the most recent record
        </button>
      </div>

      {/* Update Form */}
      {rowToUpdate && (
        <div className="mt-6">
          <h2 className="text-xl font-medium mb-4 text-center">
            Update Revenue Data
          </h2>
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Update Form Inputs */}
              {Object.keys(rowToUpdate).map(
                (key) =>
                  key !== "id" && (
                    <div key={key}>
                      <label className="block mb-2">{key}</label>
                      <input
                        type={key === "Date" ? "date" : "text"}
                        name={key}
                        value={rowToUpdate[key]}
                        onChange={handleUpdateInputChange}
                        className="border border-gray-300 rounded-md px-4 py-2 w-full"
                        required
                      />
                    </div>
                  )
              )}
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-yellow-500 text-white py-2 px-6 rounded-md mt-4"
              >
                Update Row
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Revenue;
