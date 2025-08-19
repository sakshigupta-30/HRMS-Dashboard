export const BankDetailsSection = ({ data, updateData, fieldsDisabled }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({
      ...data,
      [name]: value,
    });
  };

  return (
    <section className="bg-white rounded-lg p-6 my-8 shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold mb-5">Bank Details</h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          disabled={fieldsDisabled}
          type="text"
          name="accountNumber"
          placeholder="Account Number"
          value={data.accountNumber}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          disabled={fieldsDisabled}
          type="text"
          name="ifsc"
          placeholder="IFSC Code"
          value={data.ifsc}
          onChange={handleChange}
          className="border p-2 rounded"
        />
      </div>
    </section>
  );
};