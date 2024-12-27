import React, { useEffect, useState } from "react";
import axios from "axios";

const CurrentWar = () => {
  const [currentWar, setCurrentWar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("stars");  // Dropdown value to sort by

  const CLAN_TAG = process.env.REACT_APP_CLAN_TAG;
  const apiUrl = `/api/clans/${CLAN_TAG}/currentwar`;

  useEffect(() => {
    const fetchCurrentWar = async () => {
      try {
        setLoading(true);
        const response = await axios.get(apiUrl);
        setCurrentWar(response.data);
      } catch (err) {
        console.error("Error fetching current war data:", err);
        setError("Error fetching current war data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentWar();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const { clan, opponent } = currentWar || {};

  // Check if 'clan' and 'opponent' exist
  if (!clan || !opponent) {
    console.log("Missing data:", { clan, opponent });
    return <p>Some required data is missing. Please try again later.</p>;
  }

  const clanMembers = clan?.members || [];
  const opponentMembers = opponent?.members || [];

  // Function to sort members based on the selected filter (Stars or Attacks Left)
  const sortMembers = (members) => {
    return [...members].sort((a, b) => {
      if (sortBy === "stars") {
        return getTotalStars(b) - getTotalStars(a);  // Sort by total stars (descending)
      } else if (sortBy === "attacksLeft") {
        return getRemainingAttacks(b) - getRemainingAttacks(a);  // Sort by attacks left (descending)
      }
      return 0;
    });
  };

  // Sorted members
  const sortedClanMembers = sortMembers(clanMembers);
  const sortedOpponentMembers = sortMembers(opponentMembers);
  
  return (
    <div className="bg-slate-600">
      <div className="flex justify-between p-4 container mx-auto ">
        {/* Own Clan Section */}
        <div className="w-1/2 p-4 bg-blue-400 shadow-blue-900 shadow-xl rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-4">{clan.name}</h2>
          <img
            src={clan.badgeUrls.large}
            alt="Clan Badge"
            className="w-24 h-24 mx-auto mb-4"
          />
          <p className="text-lg text-center mb-2">
            <strong>Destruction %: </strong>{clan.destructionPercentage}
          </p>
          <p className="text-lg text-center mb-4">
            <strong>Stars: </strong>{clan.stars}
          </p>
  
          {/* Filter Dropdown for Sorting */}
          <div className="mb-4 text-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded bg-blue-600 text-white focus:outline-none"
            >
              <option value="stars">Sort by Stars</option>
              <option value="attacksLeft">Sort by Attacks Left</option>
            </select>
          </div>
  
          {/* Clan Members Stats */}
          <h3 className="text-2xl font-semibold mb-4">Your Clan Members</h3>
          <ul>
            {sortedClanMembers.map((member) => (
              <li key={member.tag} className="flex justify-between items-center mb-2">
                <span className="flex-1 text-left">{member.name}</span>
                <span className="flex-1 text-center">{getTotalStars(member)} Stars</span>
                <span className="flex-1 text-right">{getRemainingAttacks(member)} Attacks Left</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6"></div>
        {/* Enemy Clan Section */}
        <div className="w-1/2 p-4 bg-red-400 shadow-red-900 shadow-xl rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-4">{opponent.name}</h2>
          <img
            src={opponent.badgeUrls.large}
            alt="Opponent Clan Badge"
            className="w-24 h-24 mx-auto mb-4"
          />
          <p className="text-lg text-center mb-2">
            <strong>Destruction %: </strong>{opponent.destructionPercentage}
          </p>
          <p className="text-lg text-center mb-4">
            <strong>Stars: </strong>{opponent.stars}
          </p>
  
          {/* Filter Dropdown for Sorting */}
          <div className="mb-4 text-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded bg-red-600 text-white focus:outline-none"
            >
              <option value="stars">Sort by Stars</option>
              <option value="attacksLeft">Sort by Attacks Left</option>
            </select>
          </div>
  
          {/* Enemy Members Stats */}
          <h3 className="text-2xl font-semibold mb-4">Opponent Clan Members</h3>
          <ul>
            {sortedOpponentMembers.map((member) => (
              <li key={member.tag} className="flex justify-between items-center mb-2">
                <span className="flex-1 text-left">{member.name}</span>
                <span className="flex-1 text-center">{getOpponentStars(member)} Stars</span>
                <span className="flex-1 text-right">{getRemainingAttacks(member)} Attacks Left</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
  
};

// Function to calculate total stars for the own clan member
const getTotalStars = (member) => {
  return (member.attacks || []).reduce((total, attack) => total + attack.stars, 0) || 0;
};

// Function to calculate total stars for the opponent's best attack on each member
const getOpponentStars = (member) => {
    return (member.attacks || []).reduce((total, attack) => total + attack.stars, 0);
  };

// Function to calculate remaining attacks for each member
const getRemainingAttacks = (member) => {
  const totalAttacks = member.attacksPerMember || 2; // Default to 2 if not specified
  const usedAttacks = (member.attacks || []).length;  // Number of attacks already used
  return Math.max(0, totalAttacks - usedAttacks);  // Ensure remaining attacks don't go below 0
};

export default CurrentWar;
