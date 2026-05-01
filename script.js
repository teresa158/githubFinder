const state = {
    currentuser: null,
    favoris: [],
    isViewingfavoris: false
}

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-Btn');
const container = document.getElementById("container");
const userProfile = document.getElementById('userprofile');
const profile = document.getElementById('profil');
const fcontainer = document.getElementById('f-container');
const reposList = document.getElementById('reposities');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const Favorites = document.getElementById('Favorites');
const bookmarkCount = document.getElementById('bookmarkCount');


//local storage : recuperer les favoris enregistrés dans le nav
function saveFavorites(){
    localStorage.setItem("favorites", JSON.stringify(favoris.state));
}

// Afficher et remplir le profile
function displayprofile(user){
    profile.innerHTML =  ` 
    <img src="${user.avatar_url}" alt="profile">
    <h2>${user.name}</h2>
    <p>@${user.login}</p>
    <p>${user.bio || "No bio available"}</p>
    <button class="add-favorites"> Add to favorites </button>
    <a href="${user.html_url}" target="_blank">View on GitHub</a>
    
    `
}


// Afficher et remplir le f-container
function displayfcontainer(user){
    fcontainer.innerHTML =  ` 
    <div class="repositories">
    <h2 class="public-repos">Public Repositories</h2>
    <p id="repos-count">${user.public_repos}</p>
    </div>

    <div class="followers">
    <h2 class="followers">Followers</h2>
    <p id="followers-count">${user.followers}</p>
    </div>

    <div class="following">
    <h2 class="following">Following</h2>
    <p id="following-count">${user.following}</p>
    </div> 
 `
}

// Afficher et remplir la liste des repos
function displayRepos(repos){
    reposList.innerHTML = "";
    reposList.innerHTML = repos.map(repo => `
        <div class="repo-card">
            <h3>${repo.name}</h3>
            <p>${repo.description || "No description"}</p>
            <div class="repo-info">
                <span>⭐ ${repo.stargazers_count}</span>
                <a href="${repo.html_url}" target="_blank">View</a>
            </div>
        </div>
    `).join("");
}

// Afficher le loader
function showLoading() {
    loading.style.display = "block";
    error.style.display = "none";
    userProfile.style.display = "none";
    reposList.style.display = "none";
}

// Afficher le message d'erreur
function showError(message) {
    error.style.display = "block";
    error.textContent = message;
    loading.style.display = "none";
    userProfile.style.display = "none";
    reposList.style.display = "none";
}

