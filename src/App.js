import React, { useState } from "react";
import axios from "axios";
import './App.css';

function App() {
  const apiKey = 'AIzaSyCY3R4IGM53o1ad6aQW9PV_g3tm_NMTDGA'; // Replace with your actual API key
  const [address, setAddress] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);


  const getOfficeInfo = (officialIndex) => {
    const official = data[officialIndex];
    const officeIndex = official && official.officialIndices && official.officialIndices[0];
  
    return officeIndex !== undefined && data[officeIndex] ? data[officeIndex].name : "";
  };
  


  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://www.googleapis.com/civicinfo/v2/representatives?address=${encodeURIComponent(address)}&key=${apiKey}`);
      console.log("Response data:", response.data);
      setData(response.data.officials);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
    }
  };

  const handleFetchData = () => {
    // Fetch data only if the address is not empty
    if (address.trim() !== "") {
      fetchData();
    }
  };

  const officialsList = [...data].map((official, index) => ({
    name: official.name,
    office: getOfficeInfo(index),
    divisionId: official.divisionId,
    party: official.party,
    phones: official.phones,
    urls: official.urls,
    channels: official.channels,
    address: official.address && official.address[0], // Taking the first address if available
    photoUrl: official.photoUrl,
    emails: official.emails,
  }));
  

  return (
    <div className="App">
      <h1 style={{ color: "green" }}>Using Axios Library to Fetch Data</h1>
      <div>
        <label htmlFor="addressInput">Enter Address:</label>
        <input
          type="text"
          id="addressInput"
          value={address}
          onChange={handleAddressChange}
        />
        <button onClick={handleFetchData}>Fetch Data</button>
      </div>
      <center>
        {error ? (
          <p style={{ color: 'red' }}>Error fetching data: {error.message}</p>
        ) : (
          <div>
            {officialsList.length > 0 && (
              <p>Officials for address: {address}</p>
            )}
            {officialsList.map((official, index) => (
              <div
                key={index}
                style={{
                  width: "20em",
                  backgroundColor: "#CD8FFD",
                  padding: 10,
                  borderRadius: 10,
                  marginBlock: 10,
                }}
              >
                <img
                  src={official.photoUrl}
                  alt={official.name}
                  style={{ width: "100%", borderRadius: 5, marginBottom: 10 }}
                />
                <p style={{ fontSize: 20, color: 'white' }}>{official.name}</p>
                <p>{official.office}</p>
                {official.address && (
                  <p>
                    Address: {official.address.line1}, {official.address.city}, {official.address.state} {official.address.zip}
                  </p>
                )}
                {official.party && <p>Party: {official.party}</p>}
                {official.phones && (
                  <p>Phone: {official.phones.join(", ")}</p>
                )}
                {official.emails && (
                  <p>Email: {official.emails.join(", ")}</p>
                )}
                {official.urls && (
                  <div>
                    <p>Links:</p>
                    <ul>
                      {official.urls.map((url, index) => (
                        <li key={index}>
                          <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {official.channels && (
                  <div>
                    <p>Channels:</p>
                    <ul>
                      {official.channels.map((channel, index) => (
                        <li key={index}>
                          {channel.type}: <a href={channel.id} target="_blank" rel="noopener noreferrer">{channel.id}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </center>
    </div>
  );
}

export default App;
