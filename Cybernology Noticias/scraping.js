document.addEventListener("DOMContentLoaded", function() {
    const newsContainer = document.getElementById("news-container");

    const apiKey = '97f10eb11amshb23ae4c7d2ff343p13fa5djsn83686a145576';
    const url = 'https://google-news13.p.rapidapi.com/technology?lr=en-US';

    const CACHE_KEY = 'news-cache';
    const CACHE_EXPIRATION = 30 * 60 * 1000;

    function fetchNews() {
        fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': 'google-news13.p.rapidapi.com',
                'Accept': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);

                if (data && data.items && data.items.length > 0) {
                    localStorage.setItem(CACHE_KEY, JSON.stringify({
                        timestamp: Date.now(),
                        articles: data.items
                    }));
                    displayNews(data.items);
                } else {
                    newsContainer.innerHTML = "<p>No se encontraron noticias tecnológicas.</p>";
                }
            })
            .catch(error => {
                console.error("Error al obtener noticias:", error);
                newsContainer.innerHTML = "<p>Error al cargar las noticias.</p>";
            });
    }

    function displayNews(articles) {
        newsContainer.innerHTML = '';
        articles.forEach(article => {
            const newsItem = document.createElement("div");
            newsItem.classList.add("news-item");

            const title = document.createElement("h3");
            title.innerText = article.title;
            newsItem.appendChild(title);

            const description = document.createElement("p");
            description.innerText = article.snippet;
            newsItem.appendChild(description);

            const link = document.createElement("a");
            link.href = article.newsUrl;
            link.innerText = "Leer más";
            link.target = "_blank";
            newsItem.appendChild(link);

            newsContainer.appendChild(newsItem);
        });
    }

    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        const isCacheValid = (Date.now() - parsedData.timestamp) < CACHE_EXPIRATION;

        if (isCacheValid) {
            displayNews(parsedData.articles);
        } else {
            fetchNews();
        }
    } else {
        fetchNews();
    }
});

