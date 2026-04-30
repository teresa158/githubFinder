const state = {
    currentuser: null,
    favoris: [],
    isViewingfavoris: false
}

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-Btn');
const dashboard = document.getElementById("dashboard");
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
