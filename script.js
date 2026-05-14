// STATE
const state = {
  currentUser: null,
  repos: [],
  bookmarks: []
};

// DOM ELEMENTS
const searchInput        = document.getElementById('search');
const searchBtn          = document.getElementById('search-btn');
const userProfile        = document.getElementById('profil');
const fContainer         = document.getElementById('f-container');
const reposList          = document.getElementById('reposities');
const welcomeState       = document.getElementById('welcomestate');
const loadingState       = document.getElementById('loading');
const errorState         = document.getElementById('error');
const favSection         = document.getElementById('Favorites');
const userProfileSection = document.getElementById('user-profile');
const navFavBtn          = document.getElementById('favorits');  // ✅ corrigé

// affiche la page des favoris
let showFavOnly = false;

// LOCAL STORAGE
function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(state.bookmarks));
}

function loadFavorites() {
  const data = localStorage.getItem("favorites");
  state.bookmarks = data ? JSON.parse(data) : [];
}

// UI STATES
function showLoading() {
  loadingState.style.display       = "block";
  errorState.style.display         = "none";
  welcomeState.style.display       = "none";
  userProfileSection.style.display = "none";
  favSection.style.display         = "none";
  userProfile.innerHTML            = "";
  fContainer.innerHTML             = "";
  reposList.innerHTML              = "";
}

function showError(message) {
  errorState.style.display   = "block";
  errorState.textContent     = message;
  loadingState.style.display = "none";
  welcomeState.style.display = "none";
}

function showWelcome() {
  welcomeState.style.display       = "block";
  loadingState.style.display       = "none";
  errorState.style.display         = "none";
  userProfileSection.style.display = "none";
  favSection.style.display         = "none";
}

// API - USER
async function fetchUser(username) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (!res.ok) throw new Error("User not found");
    return await res.json();
  } catch (err) {
    showError(err.message);
    return null;
  }
}

// API - REPOS
async function fetchUserRepos(username) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=6`);
    if (!res.ok) throw new Error("Error fetching repositories");
    return await res.json();
  } catch (err) {
    showError(err.message);
    return null;
  }
}

// DISPLAY USER
function displayUser(user) {
  userProfile.innerHTML = `
    <img src="${user.avatar_url}" alt="avatar">
    <h2>${user.name || "No name"}</h2>
    <p>@${user.login}</p>
    <p>${user.bio || "No bio available."}</p>
    <a href="${user.html_url}" target="_blank">View on GitHub ↗</a>
    <button class="add-favorites" id="favBtn">⭐ Add to Favorites</button>
  `;

  fContainer.innerHTML = `
    <div class="repositories">
      <h2>Repositories</h2>
      <p>${user.public_repos}</p>
    </div>
    <div class="followers">
      <h2>Followers</h2>
      <p>${user.followers}</p>
    </div>
    <div class="following">
      <h2>Following</h2>
      <p>${user.following}</p>
    </div>
  `;

  userProfileSection.style.display = "flex";
  loadingState.style.display       = "none";

  document.getElementById("favBtn").addEventListener("click", () => {
    addToFavorites(user);
  });
}

// DISPLAY REPOS
function displayRepos(repos) {
  reposList.innerHTML = "";

  repos.forEach(repo => {
    const card = document.createElement("div");
    card.classList.add("repo-card");
    card.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description || "No description provided."}</p>
      <div class="repo-info">
        <span>⭐ ${repo.stargazers_count} &nbsp; 🍴 ${repo.forks_count}</span>
        <a href="${repo.html_url}" target="_blank">View</a>
      </div>
    `;
    reposList.appendChild(card);
  });
}

// FAVORITES
function addToFavorites(user) {
  const exists = state.bookmarks.find(u => u.login === user.login);
  if (exists) {
    showToast(`${user.login} is already in favorites.`);
    return;
  }
  state.bookmarks.push(user);
  saveFavorites();
  displayFavorites();
  showToast(`${user.login} added to favorites!`);
}

function removeFromFavorites(username) {
  state.bookmarks = state.bookmarks.filter(u => u.login !== username);
  saveFavorites();
  displayFavorites();
}

function displayFavorites() {
  //le btn favoris dans navbar
  navFavBtn.textContent = `Favorites (${state.bookmarks.length})`;

  //div vide des cartes qui vont s'ajouter
  favSection.innerHTML = `
    <h2>Favorites</h2>
    <div id="fav-grid"></div>
  `;
   
  //Vérifier si la liste favoris est vide, si oui on affiche un message
  if (state.bookmarks.length === 0) {
    favSection.innerHTML += `
      <p style="color:var(--m); text-align:center; font-size:13px; margin-top:10px;">
        No favorites yet — search a user and add them!
      </p>`;
    return;
  }

  const grid = favSection.querySelector("#fav-grid");

  state.bookmarks.forEach(user => {
    const card = document.createElement("div");
    card.classList.add("profile-card");

    card.innerHTML = `
      <img src="${user.avatar_url}" alt="avatar">
      <h2>${user.name || "No name"}</h2>
      <span class="username">@${user.login}</span>
      <p>${user.bio || "No bio available."}</p>
      <div class="stats">
        <span>📁 Repos: ${user.public_repos}</span>
        <span>👥 Followers: ${user.followers}</span>
        <span>➡️ Following: ${user.following}</span>
      </div>
      <div style="margin-top:4px;">
        <button class="view-btn">View</button>
        <button class="remove-btn">Remove</button>
      </div>
    `;

    //click sur btn view
    card.querySelector(".view-btn").addEventListener("click", async () => {
      showFavOnly = false; //désactiver mode favoris
      showLoading(); // affiche loading
      const repos = await fetchUserRepos(user.login); //recuperation du repos
      state.currentUser = user;
      state.repos       = repos || [];
      displayUser(user);
      if (repos) displayRepos(repos);
      loadingState.style.display = "none";
      favSection.style.display   = "none";
    });

    card.querySelector(".remove-btn").addEventListener("click", () => {
      removeFromFavorites(user.login);
    });

    grid.appendChild(card);
  });
}


// MAIN SEARCH
async function handleSearch() {
  const username = searchInput.value.trim(); //récupere le text tapé dans l'input et trim enlève les espaces unitiles
  if (!username) { //si vide
    showError("Please enter a GitHub username.");
    return;
  }

  showLoading();

  const user = await fetchUser(username); //Récupérer l’utilisateur GitHub
  if (!user) return; //Vérifier si user existe

  const repos = await fetchUserRepos(username); //Récupérer les repositories
  state.currentUser = user; //garde l’utilisateur actuel
  state.repos       = repos || []; //garde les repos

  displayUser(user);
  if (repos) displayRepos(repos);

  loadingState.style.display = "none";
  errorState.style.display   = "none";
  showFavOnly = false;
}

// EVENTS
searchBtn.addEventListener('click', handleSearch);

searchInput.addEventListener('keypress', (e) => {
  if (e.key === "Enter") handleSearch();
});

navFavBtn.addEventListener("click", (e) => {
  e.preventDefault();
  showFavOnly = !showFavOnly;

  if (showFavOnly) {
    displayFavorites();                          
    favSection.style.display         = "block";
    userProfileSection.style.display = "none";
    welcomeState.style.display       = "none";
    errorState.style.display         = "none";
    loadingState.style.display       = "none";
    reposList.innerHTML              = "";
  } else {
    favSection.style.display = "none";
    showWelcome();
  }
});

// INIT
loadFavorites();
displayFavorites();
showWelcome();