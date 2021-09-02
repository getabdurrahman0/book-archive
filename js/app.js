// get all required element and set it globally to access anywhere

const searchInput = document.getElementById("search_input");
const resultsDiv = document.getElementById("results");
const resultsCount = document.getElementById("results_count");
const topResults = document.getElementById("top_results");
const errorDiv = document.getElementById("error"); 
const loader = document.getElementById("loader");

//showing how many result found for keyword
const showResultCount = (number, searchText) => {
  resultsCount.innerText = `About ${number} results found for keyword " ${searchText} "`;
  
};

// Call the loadResult() when press 'Enter' key in SearchInput
document.getElementById("search_input").addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    loadResults();
  }
});

// load results
const loadResults = async () => {
  const searchText = searchInput.value; //get input value

  //set value empty
  resultsDiv.textContent = "";
  resultsCount.textContent = "";
  searchInput.value = "";

  topResults.style.display = "none";
  loader.style.display = "block";

  // alert when searchText is empty
  if (searchText == "") {
    loader.style.display = "none";
    errorDiv.innerText = "You have to write something to search!";
  } else {
    try {
      const url = `https://openlibrary.org/search.json?q=${searchText}`;
      const res = await fetch(url);
      const data = await res.json();
      const resultFound = data?.numFound;
      showResultCount(resultFound, searchText); //show numbers of result
      showResults(data?.docs);
    } catch (error) {
      alert("Something went wrong! Please wait and try again.",error.status);
    }
    errorDiv.innerText = "";
  }
};


//Displaying results
const showResults = (data) => {
  if (data?.length == 0) {
    alert("No search Result found !!"); // show alert when search result not found 
  }

  topResults.innerText = `Showing top ${data?.length} results`; // show how many result are displaying

  data?.forEach((item) => {
    const bookName = item?.title;
    const authors = item?.author_name?.map((name) => name).toString();
    const firstPublish = item?.first_publish_year;
    const publishers = item?.publisher?.[0];
    const imgUrl = `https://covers.openlibrary.org/b/id/${item?.cover_i}-M.jpg`;

    const div = document.createElement("div");
    div.className = "col";
    div.innerHTML = `
        <div class="card border-0 shadow-lg" style="height:100%;border-radius: 10px; margin-top:5px;">
            ${
              item?.cover_i
                ? `<img src=${imgUrl} class="h-75 w-75  mt-4 mx-auto" alt="...">`
                : ""
            }
            <div class="card-body">
                <h5 class="card-title fw-bolder">${
                  bookName ? bookName : ""
                }</h5>
                <p class="card-text"> ${
                  authors ? `Author : <strong> ${authors}</strong>` : ""
                } </p>
                <p class="card-text"> ${
                  firstPublish
                    ? `First Published : <strong> ${firstPublish} </strong>`
                    : ""
                }</p>
                <p class="card-text">${
                  publishers
                    ? `Publishers : <strong> ${publishers} </strong>`
                    : ""
                }</p>
            </div>
      </div>
        `;
    resultsDiv.appendChild(div); //append created div element to result div
  });
  loader.style.display = "none"; //hide loader
  topResults.style.display = "block";
};