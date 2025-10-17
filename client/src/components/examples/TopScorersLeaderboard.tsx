import TopScorersLeaderboard from "../TopScorersLeaderboard";

export default function TopScorersLeaderboardExample() {
  const mockScorers = [
    { playerName: "Lionel Messi", teamName: "FC Barcelona", goals: 18 },
    { playerName: "Cristiano Ronaldo", teamName: "Real Madrid", goals: 16 },
    { playerName: "Luis Suarez", teamName: "FC Barcelona", goals: 14 },
    { playerName: "Karim Benzema", teamName: "Real Madrid", goals: 12 },
    { playerName: "Antoine Griezmann", teamName: "Atletico Madrid", goals: 11 },
    { playerName: "Sergio Aguero", teamName: "Sevilla FC", goals: 10 },
  ];

  return (
    <div className="p-6">
      <TopScorersLeaderboard scorers={mockScorers} />
    </div>
  );
}
