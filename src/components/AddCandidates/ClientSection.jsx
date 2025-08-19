export const ClientSection = ({ data, updateData, fieldsDisabled }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({
      ...data,
      [name]: value,
    });
  };

  return (
    <section className="bg-white rounded-lg p-6 my-8 shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold mb-5">Client Details</h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          disabled={fieldsDisabled}
          type="text"
          name="clientName"
          placeholder="Client Name"
          value={data.clientName}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          disabled={fieldsDisabled}
          type="text"
          name="clientLocation"
          placeholder="Client Location"
          value={data.clientLocation}
          onChange={handleChange}
          className="border p-2 rounded"
        />
      </div>
    </section>
  );
};