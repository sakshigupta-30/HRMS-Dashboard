import React from "react";

const SalarySection = ({ data, updateData, fieldsDisabled }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({
      ...data,
      [name]: value,
    });
  };

  return (
    <section className="bg-white rounded-lg p-6 my-8 shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold mb-5">
        Salary Details
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <input disabled={fieldsDisabled}
          type="number"
          name="basic"
          placeholder="Basic Salary"
          value={data.basic}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input disabled={fieldsDisabled}
          type="number"
          name="hra"
          placeholder="HRA"
          value={data.hra}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input disabled={fieldsDisabled}
          type="number"
          name="retention"
          placeholder="Retention"
          value={data.retention}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input disabled={fieldsDisabled}
          type="number"
          name="otherAllowances"
          placeholder="Other Allowances"
          value={data.otherAllowances}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input disabled={fieldsDisabled}
          type="number"
          name="actualSalary"
          placeholder="Actual Salary"
          value={data.actualSalary}
          onChange={handleChange}
          className="border p-2 rounded"
        />
      </div>
    </section>
  );
};

export default SalarySection;