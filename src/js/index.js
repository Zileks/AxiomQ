const loader = document.querySelector("#loading");

function displayLoading() {
    loader.classList.add("display");
    setTimeout(() => {
        loader.classList.remove("display");
    }, 5000)
}

function hideLoading() {
    loader.classList.remove("display");
}


let page = 8;
let lastResult = [];
let itemsPerPage = 10;




function getPage (e) {
    document.querySelectorAll('.fetch').forEach(e => {
        e.parentNode.removeChild(e);
    })
    document.querySelectorAll('.button').forEach(e => {
        e.parentNode.removeChild(e);
    })
    page = e.currentTarget.innerHTML;
    fetchData();
}


function paginationButton (maxCount) {
    let lastpage = Math.ceil(maxCount/itemsPerPage);
    let button;
    for(i=1; i<=lastpage; i++){
        button = document.createElement(`button`);
        button.classList.add('button')
        document.querySelector('#pagination').appendChild(button)
        button.innerHTML = i;
        if(i==page){
            button.classList.add('active')
        }
        button.addEventListener('click', getPage);
    }
}

function fetchData() {
    displayLoading();
    fetch(`http://swapi.dev/api/people/?page=${page}`)
    .then(res => {
        if(!res.ok){
            throw Error("ERROR");
        }
        return res.json();
    })
    .then(data => {
        hideLoading();
        paginationButton(data.count)
        const html = data.results.map(user => {
            return `
                <tr class="fetch">
                    <th>${user.name}</th>
                    <th>${user.eye_color}</th>
                    <th class="height">${user.height}</th>
                    <th>${user.birth_year}</th>
                    <th class="vehicles">${user.vehicles.length}</th>
                </tr>
            `
        }).join("");
        document.querySelector('#app').insertAdjacentHTML("beforeend", html);
        const highest = Math.max(...data.results.map(e => e.height), 0);
        document.querySelectorAll('.height').forEach( (e) => {
            if(e.innerHTML == highest)
            e.style.backgroundColor = 'red';
        })
        document.querySelectorAll('.vehicles').forEach( (e) => {
            if(e.innerHTML == 0)
            e.style.backgroundColor = 'blue';
        })
    })
    .catch(error => {
        console.log(error);
    })
}

fetchData();


