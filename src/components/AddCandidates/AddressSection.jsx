import React, { useState, useEffect } from 'react';
import { Country, State } from 'country-state-city';

// Reusable style constants, now with disabled styles included
const labelClasses = "block font-medium mb-1 text-slate-800";
const inputClasses = "w-full p-2 border border-slate-300 rounded-md bg-white text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:bg-slate-100 disabled:opacity-70 disabled:cursor-not-allowed";

const AddressSection = ({ data, updateData }) => {
  // All your state and logic functions for country/state dropdowns and syncing addresses
  // remain exactly the same. No changes are needed there.

  const allCountries = Country.getAllCountries();
  const [presentStatesList, setPresentStatesList] = useState([]);
  const [permanentStatesList, setPermanentStatesList] = useState([]);

  // Get data from props, unchanged
  const present = data?.present || {};
  const permanent = data?.permanent || {};
  const sameAsPresent = data?.sameAsPresent || false;

  // All useEffect and handler functions remain exactly the same...
  useEffect(() => {
    if (present.country) {
      setPresentStatesList(State.getStatesOfCountry(present.country));
    }
  }, [present.country]);

  useEffect(() => {
    if (permanent.country) {
      setPermanentStatesList(State.getStatesOfCountry(permanent.country));
    }
  }, [permanent.country]);

  useEffect(() => {
    if (sameAsPresent) {
      updateData({ ...data, permanent: { ...present }, sameAsPresent: true });
    }
  }, [sameAsPresent, present]);

  const handlePresentChange = (e) => {
    const { name, value } = e.target;
    updateData({ ...data, present: { ...present, [name]: value } });
  };

  const handlePermanentChange = (e) => {
    const { name, value } = e.target;
    updateData({ ...data, permanent: { ...permanent, [name]: value } });
  };

  const handleSameAsPresentChange = (e) => {
    updateData({ ...data, sameAsPresent: e.target.checked });
  };


  return (
    <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-slate-200">
      <h3 className="text-xl font-semibold text-slate-800 mb-5 pb-2 border-b border-slate-200">
        Address
      </h3>

      {/* Present Address */}
      <h4 className="text-base font-semibold mt-6 mb-3 text-slate-800">Present Address</h4>
      <div className="flex flex-col gap-4">
        <input name="address1" value={present.address1} onChange={handlePresentChange} placeholder="Address Line 1" className={inputClasses} />
        <input name="address2" value={present.address2} onChange={handlePresentChange} placeholder="Address Line 2" className={inputClasses} />
        
        <div className="flex flex-col sm:flex-row gap-4">
          <input name="city" value={present.city} onChange={handlePresentChange} placeholder="City" className={`${inputClasses} flex-1`} />
          <input name="postalCode" value={present.postalCode} onChange={handlePresentChange} placeholder="Postal Code" className={`${inputClasses} flex-1`} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <select name="country" value={present.country} onChange={handlePresentChange} className={`${inputClasses} flex-1`}>
            <option value="">Select Country</option>
            {allCountries.map((c) => (<option key={c.isoCode} value={c.isoCode}>{c.name}</option>))}
          </select>

          <select name="state" value={present.state} onChange={handlePresentChange} className={`${inputClasses} flex-1`}>
            <option value="">Select State</option>
            {presentStatesList.map((s) => (<option key={s.isoCode} value={s.isoCode}>{s.name}</option>))}
          </select>
        </div>
      </div>

      {/* Checkbox */}
      <div className="my-6">
        <label htmlFor="sameAs" className="inline-flex items-center cursor-pointer text-slate-800">
          <input
            type="checkbox"
            id="sameAs"
            checked={sameAsPresent}
            onChange={handleSameAsPresentChange}
            className="mr-2 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          Same as Present address
        </label>
      </div>

      {/* Permanent Address */}
      <h4 className="text-base font-semibold mt-6 mb-3 text-slate-800">Permanent Address</h4>
      <div className="flex flex-col gap-4">
        <input name="address1" value={permanent.address1} onChange={handlePermanentChange} placeholder="Address Line 1" className={inputClasses} disabled={sameAsPresent} />
        <input name="address2" value={permanent.address2} onChange={handlePermanentChange} placeholder="Address Line 2" className={inputClasses} disabled={sameAsPresent} />

        <div className="flex flex-col sm:flex-row gap-4">
          <input name="city" value={permanent.city} onChange={handlePermanentChange} placeholder="City" className={`${inputClasses} flex-1`} disabled={sameAsPresent} />
          <input name="postalCode" value={permanent.postalCode} onChange={handlePermanentChange} placeholder="Postal Code" className={`${inputClasses} flex-1`} disabled={sameAsPresent} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <select name="country" value={permanent.country} onChange={handlePermanentChange} className={`${inputClasses} flex-1`} disabled={sameAsPresent}>
            <option value="">Select Country</option>
            {allCountries.map((c) => (<option key={c.isoCode} value={c.isoCode}>{c.name}</option>))}
          </select>
          <select name="state" value={permanent.state} onChange={handlePermanentChange} className={`${inputClasses} flex-1`} disabled={sameAsPresent}>
            <option value="">Select State</option>
            {permanentStatesList.map((s) => (<option key={s.isoCode} value={s.isoCode}>{s.name}</option>))}
          </select>
        </div>
      </div>
    </section>
  );
};

export default AddressSection;