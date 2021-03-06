const addSearchFunctionality = side => {
    if (document.getElementById(`${side}-search-button`)) {
        document.getElementById(`${side}-search-button`).addEventListener('click', function (event) {

            const actorToSearch = getActorToSearch(side)
            const searchResultsSpace = document.querySelector(`#${side}-search-results`)

            axios
                .get(`${myAPIurl}/game/actor/${actorToSearch}`)
                .then(response => {
                    const { data } = response
                    let searchResults = ''
                    data.forEach(elm => searchResults += createSearchResult(elm, side))
                    searchResultsSpace.innerHTML = searchResults
                    addSearchResultFunctionality(side)
                })
                .catch(err => console.log(err))
        })
    }
}


const getActorToSearch = side => {
    if (document.getElementById(`${side}-search-input`).value) {
        return document.getElementById(`${side}-search-input`).value
    } else {
        return document.getElementById(`${side}-search-input`).getAttribute('placeholder')
    }
}

const addSearchResultFunctionality = side => {
    document.querySelectorAll(`.result-${side}`).forEach(elm => {
        chooseSearchResult(elm, side)
    })
}

function chooseSearchResult(searchResultBlock, side) {
    searchResultBlock.addEventListener('click', function (event) {
        const selectedActor = event.currentTarget.outerHTML
        document.querySelector(`.${side}-search-group`).innerHTML = selectedActor

        const selectedActorId = event.currentTarget.querySelector('span').innerText
        document.querySelector(`#${side}-actorId`).value = selectedActorId

        if (document.querySelectorAll('.search-button').length < 1) {
            createButton(6)
        }
    })
}