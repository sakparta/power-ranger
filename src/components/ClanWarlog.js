import React, { useEffect, useState } from "react";
import axios from "axios";

const CLAN_TAG = process.env.REACT_APP_CLAN_TAG // Replace with your clan tag
const WARLOG_API = `/warlog/${CLAN_TAG}`; // Relative URL for warlog

// Format the date correctly
const formatDate = (dateString) => {
  // Manually fix the date and time format
  const year = dateString.slice(0, 4);
  const month = dateString.slice(4, 6);
  const day = dateString.slice(6, 8);
  const hour = dateString.slice(9, 11);
  const minute = dateString.slice(11, 13);
  const second = dateString.slice(13, 15);
  
  // Rebuild the date string in ISO 8601 format
  const isoDateString = `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`;

  const date = new Date(isoDateString);  // Create a Date object from the fixed string

  if (isNaN(date.getTime())) return "Invalid Date";  // If invalid date, return this
  return date.toLocaleDateString();  // Format as MM/DD/YYYY
};

const ClanWarlog = () => {
  const [warlog, setWarlog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWarlog = async () => {
      try {
        setLoading(true);
        const response = await axios.get(WARLOG_API);
        setWarlog(response.data.items); // Assuming 'items' contains the warlog array
      } catch (err) {
        console.error("Error fetching warlog:", err);
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

    fetchWarlog();
  }, []);

  if (loading) return <p className="text-center text-xl text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className=" bg-slate-600">
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-semibold text-center mb-6 text-white">Previous Wars</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Date</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Opponent</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Result</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Your Stars</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Opponent Stars</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Attacks Used</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Destruction % (Your Clan)</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Destruction % (Opponent)</th>
            </tr>
          </thead>
          <tbody>
            {warlog.map((war, index) => {
              const yourAttacksUsed = war.clan ? war.clan.attacks : 0;
              // Get the destruction percentages
              const yourDestruction = war.clan ? war.clan.destructionPercentage : 0;
              const opponentDestruction = war.opponent ? war.opponent.destructionPercentage : 0;
  
              return (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3 text-center text-sm text-gray-700">{formatDate(war.endTime)}</td>
                  <td className="px-6 py-3 text-center text-sm text-gray-700">{war.opponent.name}</td>
                  <td className="px-6 py-3 text-center text-sm text-gray-700">
                    <span
                      className={`inline-block py-1 px-2 rounded-md text-white ${
                        war.result && war.result === "win" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {war.result ? war.result.charAt(0).toUpperCase() + war.result.slice(1) : "No Result"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center text-sm text-gray-700">{war.clan.stars}</td>
                  <td className="px-6 py-3 text-center text-sm text-gray-700">{war.opponent.stars}</td>
                  <td className="px-6 py-3 text-center text-sm text-gray-700">{yourAttacksUsed}</td>
                  <td className="px-6 py-3 text-center text-sm text-gray-700">{yourDestruction}%</td>
                  <td className="px-6 py-3 text-center text-sm text-gray-700">{opponentDestruction}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default ClanWarlog;
