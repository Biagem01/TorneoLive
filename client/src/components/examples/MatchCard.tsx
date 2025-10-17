import MatchCard from "../MatchCard";

export default function MatchCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <MatchCard
        teamA="FC Barcelona"
        teamB="Real Madrid"
        scoreA={3}
        scoreB={2}
        status="live"
        date={new Date()}
        goalScorersA={[
          { playerName: "Messi", minute: 23 },
          { playerName: "Suarez", minute: 45 },
          { playerName: "Neymar", minute: 78 },
        ]}
        goalScorersB={[
          { playerName: "Ronaldo", minute: 15 },
          { playerName: "Benzema", minute: 89 },
        ]}
      />
      <MatchCard
        teamA="Manchester United"
        teamB="Liverpool"
        scoreA={null}
        scoreB={null}
        status="scheduled"
        date={new Date(Date.now() + 86400000 * 3)}
      />
    </div>
  );
}
