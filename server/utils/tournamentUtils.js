// server/utils/tournamentUtils.js

// 🔹 Genera i gironi reali basandosi sulle squadre del torneo
export function generateGroupsFromTeams(teams, groupSize) {
  const totalTeams = teams.length;
  const numGroups = Math.ceil(totalTeams / groupSize);

  const groups = Array.from({ length: numGroups }, (_, i) => ({
    name: `Girone ${i + 1}`,
    teams: [],
  }));

  for (let i = 0; i < totalTeams; i++) {
    groups[i % numGroups].teams.push({
      id: teams[i].id,
      name: teams[i].name,
      points: 0,
    });
  }

  return groups;
}

// 🔹 Genera un singolo turno knockout (non lo tocchiamo per ora)
function generateKnockoutRound(teams) {
  const matches = [];
  for (let i = 0; i < teams.length; i += 2) {
    matches.push({
      team1: teams[i] || null,
      team2: teams[i + 1] || null,
      winner: null,
    });
  }
  return matches;
}

// 🔹 Genera tutti i turni knockout (placeholder)
export function generateKnockoutRounds(qualifiedTeams, numRounds) {
  const rounds = [];
  let teams = [...qualifiedTeams];

  for (let i = 0; i < numRounds; i++) {
    const matches = generateKnockoutRound(teams);
    rounds.push({ round: i + 1, matches });
    teams = Array(matches.length).fill(null); // placeholder per vincitori
  }

  return rounds;
}

// 🔹 Combina gironi + knockout (solo gironi per ora)
export function generateGroupKnockoutStructure(teams, groupSize, knockoutRounds) {
  const groups = generateGroupsFromTeams(teams, groupSize);

  // Placeholder knockout (lo implementeremo dopo)
  const knockout = [];

  return { groups, knockout };
}
