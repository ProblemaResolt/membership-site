import React, { useState, useEffect, createContext } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { User } from '../../contexts/AuthContext';

interface TeamContextType {
  user: User;
}

const TeamContext = createContext<TeamContextType | null>(null);

interface TeamMember {
  id: number;
  userId: string;
  role: 'admin' | 'manager' | 'user';
  firstName: string;
  lastName: string;
}

interface Team {
  id: number;
  name: string;
  description: string;
  isPrivate: boolean;
  members: TeamMember[];
}

export const TeamManagement: React.FC = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  
  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    }
  };

  const handleInvite = async (userId: string, role: 'admin' | 'manager' | 'user') => {
    if (!selectedTeam) return;

    try {
      const response = await fetch('/api/teams/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          teamId: selectedTeam.id,
          userId,
          role
        })
      });

      if (response.ok) {
        fetchTeams();
      }
    } catch (error) {
      console.error('Failed to invite user:', error);
    }
  };

  return (
    <TeamContext.Provider value={{ user: user as User }}>
      <div className="team-management">
        <h2>チーム管理</h2>
        {/* チーム一覧 */}
        <div className="teams-list">
          {teams.map(team => (
            <div key={team.id} className="team-item">
              <h3>{team.name}</h3>
              <p>{team.description}</p>
              <button onClick={() => setSelectedTeam(team)}>
                管理
              </button>
            </div>
          ))}
        </div>

        {/* チーム詳細と管理 */}
        {selectedTeam && (
          <div className="team-details">
            <h3>{selectedTeam.name}の管理</h3>
            <div className="members-list">
              <h4>メンバー一覧</h4>
              {selectedTeam.members.map(member => (
                <div key={member.id} className="member-item">
                  <span>{member.firstName} {member.lastName}</span>
                  <span>役割: {member.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </TeamContext.Provider>
  );
};
