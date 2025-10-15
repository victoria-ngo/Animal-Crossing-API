const API_KEY = "0d3a1564-63c2-4c7d-8ac1-7a0a150adcbb"; // Replace with your Nookipedia API key
const API_URL = "https://api.nookipedia.com/villagers?game=NH";

// List of all species
const speciesList = [
  "Alligator","Anteater","Bear","Bird","Cat","Chicken","Cow",
  "Cub","Deer","Dog","Duck","Eagle","Elephant","Frog","Goat",
  "Gorilla","Hamster","Hippo","Horse","Kangaroo","Koala","Lion",
  "Monkey","Mouse","Octopus","Ostrich","Penguin","Pig","Rabbit",
  "Rhino","Sheep","Squirrel","Tiger","Wolf"
];

// Populate dropdown
const speciesSelect = document.getElementById("speciesSelect");
speciesList.forEach(species => {
  const option = document.createElement("option");
  option.value = species.toLowerCase();
  option.textContent = species;
  speciesSelect.appendChild(option);
});

// Common function to display results
function displayVillagers(data, species) {
  const resultsDiv = document.getElementById("results");
  if (data.length === 0) {
    resultsDiv.innerHTML = `<p>No villagers found for species: <b>${species}</b></p>`;
    return;
  }

  resultsDiv.innerHTML = "";
  data.forEach(villager => {
    const card = document.createElement("div");
    card.className = "villager-card";
    card.innerHTML = `
      <img src="${villager.image_url}" alt="${villager.name}">
      <h3>${villager.name}</h3>
    `;
    resultsDiv.appendChild(card);
  });
}

// Function to fetch villagers by search bar
async function searchByInput(species) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(`${API_URL}&species=${species}`, {
      headers: {
        "X-API-KEY": API_KEY,
        "Accept-Version": "1.0.0"
      }
    });
    if (!response.ok) throw new Error("API request failed");
    const data = await response.json();
    displayVillagers(data, species);
  } catch (error) {
    console.error(error);
    resultsDiv.innerHTML = `<p>Error fetching villagers.</p>`;
  }
}

// Function to fetch villagers by dropdown filter
async function searchByFilter(species) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<p>Loading...</p>";

  try {
    const url = species ? `${API_URL}&species=${species}` : API_URL;
    const response = await fetch(url, {
      headers: {
        "X-API-KEY": API_KEY,
        "Accept-Version": "1.0.0"
      }
    });
    if (!response.ok) throw new Error("API request failed");
    const data = await response.json();
    displayVillagers(data, species || "all");
  } catch (error) {
    console.error(error);
    resultsDiv.innerHTML = `<p>Error fetching villagers.</p>`;
  }
}

// Event listener for search bar
document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const species = document.getElementById("speciesInput").value.trim().toLowerCase();
  if (species) searchByInput(species);
});

// Event listener for filter button
document.getElementById("filterBtn").addEventListener("click", () => {
  const species = speciesSelect.value;
  searchByFilter(species);
});