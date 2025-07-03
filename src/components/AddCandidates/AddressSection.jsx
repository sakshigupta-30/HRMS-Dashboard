import React, { useState, useEffect } from 'react';
import { Country, State } from 'country-state-city';

const AddressSection = () => {
  const allCountries = Country.getAllCountries();

  // Present address
  const [present, setPresent] = useState({
    address1: '',
    address2: '',
    city: '',
    postalCode: '',
    country: '',
    state: '',
  });
  const [presentStatesList, setPresentStatesList] = useState([]);

  // Permanent address
  const [permanent, setPermanent] = useState({
    address1: '',
    address2: '',
    city: '',
    postalCode: '',
    country: '',
    state: '',
  });
  const [permanentStatesList, setPermanentStatesList] = useState([]);

  const [sameAsPresent, setSameAsPresent] = useState(false);

  // Update state list when country changes
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

  // Sync Permanent with Present when checkbox is checked
  useEffect(() => {
    if (sameAsPresent) {
      setPermanent({ ...present });
      setPermanentStatesList(State.getStatesOfCountry(present.country));
    }
  }, [sameAsPresent, present]);

  const handlePresentChange = (e) => {
    const { name, value } = e.target;
    setPresent({ ...present, [name]: value });
  };

  const handlePermanentChange = (e) => {
    const { name, value } = e.target;
    setPermanent({ ...permanent, [name]: value });
  };

  return (
    <section className="form-section">
      <h3>Address</h3>

      {/* Present Address */}
      <h4>Present address</h4>
      <div className="address-grid">
        <input name="address1" value={present.address1} onChange={handlePresentChange} placeholder="Address line 1" />
        <input name="address2" value={present.address2} onChange={handlePresentChange} placeholder="Address line 2" />
        <input name="city" value={present.city} onChange={handlePresentChange} placeholder="City" />

        <div className="input-row">
          <select name="country" value={present.country} onChange={handlePresentChange}>
            <option value="">Select Country</option>
            {allCountries.map((c) => (
              <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
            ))}
          </select>

          <select name="state" value={present.state} onChange={handlePresentChange}>
            <option value="">Select State</option>
            {presentStatesList.map((s) => (
              <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
            ))}
          </select>
        </div>

        <input name="postalCode" value={present.postalCode} onChange={handlePresentChange} placeholder="Postal Code" />
      </div>

      {/* Checkbox */}
<div className="same-address-sentence">
  <input
    type="checkbox"
    id="sameAs"
    checked={sameAsPresent}
    onChange={(e) => setSameAsPresent(e.target.checked)}
  />
  <label htmlFor="sameAs">Same as Present address</label>
</div>






      {/* Permanent Address */}
      <h4>Permanent address</h4>
      <div className="address-grid">
        <input
          name="address1"
          value={permanent.address1}
          onChange={handlePermanentChange}
          placeholder="Address line 1"
          disabled={sameAsPresent}
        />
        <input
          name="address2"
          value={permanent.address2}
          onChange={handlePermanentChange}
          placeholder="Address line 2"
          disabled={sameAsPresent}
        />
        <input
          name="city"
          value={permanent.city}
          onChange={handlePermanentChange}
          placeholder="City"
          disabled={sameAsPresent}
        />

        <div className="input-row">
          <select
            name="country"
            value={permanent.country}
            onChange={handlePermanentChange}
            disabled={sameAsPresent}
          >
            <option value="">Select Country</option>
            {allCountries.map((c) => (
              <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
            ))}
          </select>

          <select
            name="state"
            value={permanent.state}
            onChange={handlePermanentChange}
            disabled={sameAsPresent}
          >
            <option value="">Select State</option>
            {permanentStatesList.map((s) => (
              <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
            ))}
          </select>
        </div>

        <input
          name="postalCode"
          value={permanent.postalCode}
          onChange={handlePermanentChange}
          placeholder="Postal Code"
          disabled={sameAsPresent}
        />
      </div>
    </section>
  );
};

export default AddressSection;
