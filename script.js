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
