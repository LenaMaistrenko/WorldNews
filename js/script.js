document.getElementById("filter-form").addEventListener("submit", function (e) {
  e.preventDefault();
  loadNews();
});

let page = 1;

async function loadNews(initial = false) {
  const apiKey = "e76546dabd2e4209b11d3f569add4b5b";
  const keyword = document.getElementById("keyword").value.trim();
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  let apiUrl;
  const defaultImageUrl = "https://via.placeholder.com/150";

  if (initial || !keyword) {
    // Если это начальная загрузка или поиск без ключевых слов, используем "top-headlines"
    apiUrl = `https://newsapi.org/v2/top-headlines?apiKey=${apiKey}&page=${page}&pageSize=6&country=us`;
  } else {
    if (category) {
      // Если указана категория, используем "top-headlines"
      apiUrl = `https://newsapi.org/v2/top-headlines?apiKey=${apiKey}&page=${page}&pageSize=6&category=${category}`;
    } else {
      // Если категория не указана, используем "everything"
      apiUrl = `https://newsapi.org/v2/everything?apiKey=${apiKey}&page=${page}&pageSize=6`;
    }

    if (keyword) {
      apiUrl += `&q=${keyword}`;
    }

    if (date && !category) {
      // Фильтр по дате работает только для "everything"
      apiUrl += `&from=${date}&to=${date}`;
    }
  }

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (data.articles && data.articles.length > 0) {
      displayNews(data.articles);
    } else {
      document.getElementById(
        "news-container"
      ).innerHTML = `<p>No news found.</p>`;
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    document.getElementById(
      "news-container"
    ).innerHTML = `<p>Error fetching news: ${error.message}</p>`;
  }
}

function displayNews(articles) {
  const container = document.getElementById("news-container");
  container.innerHTML = "";
  const defaultImageUrl = "https://picsum.photos/150";
  console.log(articles);

  articles.forEach((article) => {
    const imageUrl = article.urlToImage || defaultImageUrl;

    const newsHTML = `
      <div class="col-md-4 mb-4">
        <div class="card">
          <img src="${imageUrl}" class="card-img-top" alt="${
            article.title
          }" style="height: 150px; object-fit: cover;">
          <div class="card-body">
            <h5 class="card-title" style="font-size: 1rem;">${
              article.title
            }</h5>
            <p class="card-text" style="font-size: 0.9rem;">${
              article.description || ""
            }</p>
            <a href="${
              article.url
            }" target="_blank" class="btn btn-primary" style="font-size: 0.85rem; padding: 0.4rem 0.8rem;">Read more</a>
          </div>
        </div>
      </div>`;

    container.innerHTML += newsHTML;
  });
}

document.getElementById("prev-page").addEventListener("click", function (e) {
  e.preventDefault();
  if (page > 1) {
    page--;
    loadNews();
  }
});

document.getElementById("next-page").addEventListener("click", function (e) {
  e.preventDefault();
  page++;
  loadNews();
});

// Загружаем новости при старте страницы
loadNews(true);
