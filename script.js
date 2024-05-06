
//fetching meals data from API
const fetchMealsFromApi = async (url, value) => {
  const response = await fetch(`${url + value}`);
  const meals = await response.json();
  return meals;
};

//initializing favourite list in local storage if not already present
if(localStorage.getItem("favouritesList") == null){
  localStorage.setItem("favouritesList", JSON.stringify([]))
}

//show meals list based on search
const showMealList = () => {
  //get the value entered by user in the search input field
  let inputValue = document.getElementById("my-search").value;
  //retrieve the list of meal IDs from localstorage and parse it into an array
  let arr = JSON.parse(localStorage.getItem("favouritesList"));
  let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  //store HTML markup to display the meals
  let html = "";
  //fetch meals from the API based on the search input
  let meals = fetchMealsFromApi(url, inputValue);
  meals.then((data) => {
    //if meals are available
    if (data.meals) {
      data.meals.forEach((element) => {
        //check if the current meal in the response data
        let isFav = arr.includes(element.idMeal);
        html += `
                    <div id="card" class="card mb-3" style="width: 20rem;">
                        <img src="${
                          element.strMealThumb
                        }" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${element.strMeal}</h5>
                            <div class="d-flex justify-content-between mt-5">
                                <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${
                                  element.idMeal
                                })">More >></button>
                                <button id = "main${
                                  element.idMeal
                                }" class="btn btn-outline-light ${
          isFav ? "active" : ""
        }" onclick="addRemoveToFavList(${
          element.idMeal
        })" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                            </div>
                        </div>
                    </div>
                `;
      });
    } 
    //if meals are not available
    else {
      html += `
                <div class="page-wrap d-flex flex-row align-items-center">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-md-12 text-center">
                                <span class="display-1 d-block">404</span>
                                <div class = "mb-4 lead">
                                    Meal Not Found.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
    }
    document.getElementById("main").innerHTML = html;
  });
};

//show more details about each meal
const showMealDetails = async (id) => {
  let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let html = "";
  await fetchMealsFromApi(url, id).then((data) => {
    html += `
        <div id="meal-details" class="mb-5">
        <div id="meal-header" class="d-flex justify-content-around flex-wrap">
            <div id="meal-thumbail">
                <img src="${data.meals[0].strMealThumb}" alt="" class="mb-2">
            </div>
            <div id="details">
                <h3>${data.meals[0].strMeal}</h3>
                <h6>Category : ${data.meals[0].strCategory}</h6>
                <h6>Area : ${data.meals[0].strArea}></h6>
            </div>
        </div>
        <div id="meal-instruction" class="mt-3">
            <h5 class="text-center">Instruction :</h5>
            <p>${data.meals[0].strInstructions}</p>
        </div>
        <div class="text-center">
            <a href="${data.meals[0].strYoutube}" target="_blank" class="btn btn-outline-light mt-3">Video</a>
        </div>
    </div>
        `;
  });
  document.getElementById("main").innerHTML = html;
};

//toggle the display of the favourite meal list
const toggleFavMealList = () => {
    var offcanvasMenu = document.getElementById("offcanvasNavbar");
    var offcanvasBackdrop = document.getElementById("offcanvasBackdrop");
    offcanvasMenu.classList.toggle("show");
    offcanvasBackdrop.classList.toggle("show");
    if(offcanvasMenu.classList.contains("show")){
        showFavMealList();
    }
}

//function to close the favourite meal list
const closeFavMealList = () => {
    var offcanvasMenu = document.getElementById("offcanvasNavbar");
    var offcanvasBackdrop = document.getElementById("offcanvasBackdrop");
    offcanvasMenu.classList.remove("show");
    offcanvasBackdrop.classList.remove("show")
}

//show the list of favourite meal list
const showFavMealList = async () => {
  let arr = JSON.parse(localStorage.getItem("favouritesList"));
  let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let html = "";
  if (arr.length === 0) {
    html += `
        <div class="container text-center">
          <p>Your favourite list is empty...</p>
        </div>
        `;
  } else {
    for (let index = 0; index < arr.length; index++) {
      await fetchMealsFromApi(url, arr[index]).then(data => {
        html += `
            <div id="card" class="card mb-3" style="width: 20rem;">
            <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${data.meals[0].strMeal}</h5>
                <div class="d-flex justify-content-between mt-5">
                    <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${data.meals[0].idMeal})">More..</button>
                    <button id = "fav${data.meals[0].idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${data.meals[0].idMeal})" style="border-radius: 50%;">
                        <i class="fa-solid fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
            `;
      });
    }
  }
  document.getElementById("favourites-body").innerHTML = html;
};

//add or remove a meal from favourite list
const addRemoveToFavList = (id) => {
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    let contain = arr.includes(id);
    if(contain){
        arr = arr.filter(item => item !== id);
        alert("Meal removed frmo list..")
    }else{
        arr.push(id);
        alert("Meal added to list...")
    }
    localStorage.setItem("favouritesList", JSON.stringify(arr));
    showMealList();
    showFavMealList();
}