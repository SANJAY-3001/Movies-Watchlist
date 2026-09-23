

const formEl = document.getElementById("search-form")
const movieListSection = document.getElementById("movie-list-section")

formEl.addEventListener("submit" , handleMovieSearch)

function handleMovieSearch(e) {
    e.preventDefault()

    const searchForm = new FormData(formEl)
    const movieTitle = searchForm.get("movie-title")

    fetch(`https://www.omdbapi.com/?s=${movieTitle}&plot=full&apikey=${ENV.API_URL}` , {method : "GET"})
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            renderMoviesList(data)
        })
}

async function renderMoviesList(data) {
    let listOfMovies = ''

    for (const movie of data.Search)
    {

        const movieDetails = await getMovieDetails(movie.imdbID)

        console.log(movieDetails)

        listOfMovies += `
        <li class="movie-box">
                            
            <img src="${movie.Poster}" class="poster">

            <div class="movie-info">

                <div>
                    <span class="movie-title">${movie.Title}</span>
                    <img src="images/star-icon.png">
                    <span class="rating">${movieDetails.imdbRating}</span>
                </div>

                <div class="movie-details">
                    <p class="duration">${movieDetails.Runtime}</p>
                    <p>${movieDetails.Genre}</p>
                    <input type="image" src="images/watchlist-icon.png" id="${movie.imdbID}">
                    <label for="${movie.imdbID}">Watchlist</label>
                </div>

                <div class="description-wrapper">
                    <p class="movie-description">${movieDetails.Plot}</p>
                    <button class="read-more">Read More</button>
                </div>

            </div>

        </li>
        <div class="line"></div>
        `
    }

    movieListSection.innerHTML = `<ul class="movies-list" id="movies-list">${listOfMovies}<ul>`

    const readMoreButtons = document.querySelectorAll(".read-more")

    readMoreButtons.forEach(button => {
        button.addEventListener('click' , () => {
            const movieDescription = button.previousElementSibling
            movieDescription.classList.toggle("expanded")

            if (movieDescription.classList.contains("expanded")) {
                button.textContent = "Read less"
            }
            else {
                button.textContent = "Read more"
            }
        })
    })

}


async function getMovieDetails(imdbID) {
    const res = await fetch(`https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${ENV.API_URL}` , {method : "GET"})
    const data = await res.json()

    return data
}

    