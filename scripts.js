
let myWatchList = []

const formEl = document.getElementById("search-form")
const movieListSection = document.getElementById("movie-list-section")
const watchListSection = document.getElementById("watchlist-section")

myWatchList = JSON.parse(localStorage.getItem("myWatchList"))

console.log(myWatchList)



if (formEl) {
    formEl.addEventListener("submit" , handleMovieSearch)
}

if (watchListSection) {
    renderMyWatchList()
}




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
                    <input type="image" src="images/watchlist-icon.png" id="${movie.imdbID}" class="watchlist-btn">
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

    const watchListBtn = document.querySelectorAll(".watchlist-btn")

    watchListBtn.forEach(input => {
        input.addEventListener('click' , (e) => {
            const imdbID = e.target.id

            if (!myWatchList.includes(imdbID)) {
                myWatchList.push(imdbID)
                // console.log(myWatchList)
                localStorage.setItem("myWatchList" , JSON.stringify(myWatchList))
            }
        })
    })

}


async function getMovieDetails(imdbID) {
    const res = await fetch(`https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${ENV.API_URL}` , {method : "GET"})
    const data = await res.json()

    return data
}



async function renderMyWatchList() {
    let myWatchListHtml = ''

        for (const imdbID of myWatchList) {
            const movieDetails = await getMovieDetails(imdbID)

            console.log(movieDetails)

            myWatchListHtml += `
            <li class="movie-box">
                                
                <img src="${movieDetails.Poster}" class="poster">

                <div class="movie-info">

                    <div>
                        <span class="movie-title">${movieDetails.Title}</span>
                        <img src="images/star-icon.png">
                        <span class="rating">${movieDetails.imdbRating}</span>
                    </div>

                    <div class="movie-details">
                        <p class="duration">${movieDetails.Runtime}</p>
                        <p>${movieDetails.Genre}</p>
                        <input type="image" src="images/remove-icon.png" id="${imdbID}" class="remove-btn">
                        <label for="${imdbID}">Remove</label>
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

        if (myWatchList.length !== 0) {

            watchListSection.innerHTML = myWatchListHtml


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
            

            const removeBtn = document.querySelectorAll(".remove-btn")

            removeBtn.forEach(button => {
                button.addEventListener('click' , (e) => {
                    const imdbID = e.target.id

                    myWatchList = myWatchList.filter(id => id !== imdbID)
                    localStorage.setItem("myWatchList" , JSON.stringify(myWatchList))

                    renderMyWatchList()
                })
            })
        }
        else {
            watchListSection.innerHTML = `
            <div class="watchlist-placeholder">
                <p>Your watchlist is looking a little empty...</p>
                <a href="index.html"><img src="images/watchlist-icon.png"> Let’s add some movies!</a>
            </div>
            `
        }

    
}
