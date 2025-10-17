import RankingsTable from "../RankingsTable";

export default function RankingsTableExample() {
  const mockRankings = [
    {
      position: 1,
      teamName: "FC Barcelona",
      played: 10,
      won: 8,
      drawn: 1,
      lost: 1,
      goalsFor: 28,
      goalsAgainst: 10,
      goalDifference: 18,
      points: 25,
    },
    {
      position: 2,
      teamName: "Real Madrid",
      played: 10,
      won: 7,
      drawn: 2,
      lost: 1,
      goalsFor: 24,
      goalsAgainst: 12,
      goalDifference: 12,
      points: 23,
    },
    {
      position: 3,
      teamName: "Atletico Madrid",
      played: 10,
      won: 6,
      drawn: 3,
      lost: 1,
      goalsFor: 20,
      goalsAgainst: 10,
      goalDifference: 10,
      points: 21,
    },
    {
      position: 4,
      teamName: "Sevilla FC",
      played: 10,
      won: 5,
      drawn: 3,
      lost: 2,
      goalsFor: 18,
      goalsAgainst: 14,
      goalDifference: 4,
      points: 18,
    },
    {
      position: 5,
      teamName: "Valencia CF",
      played: 10,
      won: 4,
      drawn: 2,
      lost: 4,
      goalsFor: 15,
      goalsAgainst: 16,
      goalDifference: -1,
      points: 14,
    },
  ];

  return (
    <div className="p-6">
      <RankingsTable rankings={mockRankings} />
    </div>
  );
}
