import React, { useEffect, useState } from "react";
import axios from "axios";

const CLAN_TAG = process.env.REACT_APP_CLAN_TAG; // Replace with your clan tag
const apiUrl = `/clan/${CLAN_TAG}`; // Use the proxy server URL



const ClanInfo = () => {
  const [clan, setClan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClanDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(apiUrl);
        setClan(response.data);
      } catch (err) {
        console.error("Error fetching clan details:", err);
        if (err.response) {
          setError(`Error ${err.response.status}: ${err.response.data.reason}`);
        } else if (err.request) {
          setError("No response from server. Check your network or proxy server.");
        } else {
          setError(`Request failed: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClanDetails();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
  
  <div className="">
  
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h1 className="text-3xl font-bold text-center mb-4">{clan.name}</h1>
      <img
        src={clan.badgeUrls.large}
        alt="Clan Badge"
        className="w-24 h-24 mx-auto mb-4"
      />
      <p className="text-xl text-center mb-2">{clan.description}</p>
      <div className="space-y-2 text-center">
        <p className="text-lg">
          <span className="font-semibold">Clan Level:</span> {clan.clanLevel}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Members:</span> {clan.members}
        </p>
        <p className="text-lg">
          <span className="font-semibold">{clan.type}</span>
        </p>
      </div>
    </div>
  </div>
  );
};

export default ClanInfo;
