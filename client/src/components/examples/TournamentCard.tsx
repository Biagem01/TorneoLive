import TournamentCard from "../TournamentCard";

export default function TournamentCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <TournamentCard
        id="1"
        name="Summer League 2024"
        startDate={new Date("2024-06-01")}
        endDate={new Date("2024-07-15")}
        status="live"
        teamCount={12}
        matchCount={24}
        onClick={() => console.log("Tournament clicked")}
      />
      <TournamentCard
        id="2"
        name="Champions Cup"
        startDate={new Date("2024-08-10")}
        endDate={new Date("2024-09-20")}
        status="upcoming"
        teamCount={8}
        matchCount={16}
        onClick={() => console.log("Tournament clicked")}
      />
      <TournamentCard
        id="3"
        name="Spring Classic"
        startDate={new Date("2024-03-01")}
        endDate={new Date("2024-04-30")}
        status="completed"
        teamCount={16}
        matchCount={32}
        onClick={() => console.log("Tournament clicked")}
      />
    </div>
  );
}
