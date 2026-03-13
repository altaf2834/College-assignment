 // ----------- NEWS API KEY -------------
const NEWS_API_KEY = "d74e19b56e03421faf33bd28fe4d91f8";

// ----------- GEMINI API KEY -------------

const newsContainer = document.getElementById("newsContainer");
const featured = document.getElementById("featuredNews");
const breaking = document.getElementById("breakingNews");
const aiOutput = document.getElementById("aiOutput");


// ----------- FETCH NEWS ----------------
async function getNews(category){

const url = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=12&apiKey=${NEWS_API_KEY}`;

const response = await fetch(url);
const data = await response.json();

displayNews(data.articles);

}


// ----------- DISPLAY NEWS ---------------
function displayNews(articles){

newsContainer.innerHTML="";

if(articles.length === 0) return;

let top = articles[0];

featured.innerHTML = `
<img src="${top.urlToImage || ''}">
<h2>${top.title}</h2>
<p>${top.description || ''}</p>
<button onclick="summarizeArticle(\`${top.description || top.title}\`)">AI Summary</button>
<button onclick="explainArticle(\`${top.description || top.title}\`)">Explain</button>
<button onclick="debateArticle(\`${top.title}\`)">Debate</button>
<a href="${top.url}" target="_blank">Read full article</a>
`;

breaking.innerHTML = articles.slice(0,6).map(a=>a.title).join(" | ");

articles.slice(1).forEach(article => {

const card = document.createElement("div");

card.className="newsCard";

card.innerHTML = `
<img src="${article.urlToImage || 'https://via.placeholder.com/300'}">

<div class="newsContent">

<h3>${article.title}</h3>

<p>${article.description || ''}</p>

<button onclick="summarizeArticle(\`${article.description || article.title}\`)">Summary</button>

<button onclick="explainArticle(\`${article.description || article.title}\`)">Explain</button>

<button onclick="debateArticle(\`${article.title}\`)">Debate</button>

<button onclick="quizArticle(\`${article.description || article.title}\`)">Quiz</button>

<a href="${article.url}" target="_blank">Read More</a>

</div>
`;

newsContainer.appendChild(card);

});

}


// ----------- GEMINI CALL FUNCTION -----------
async function callGemini(prompt){

const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
{
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
contents: [{
parts: [{ text: prompt }]
}]
})
}
);

const data = await response.json();

return data.candidates[0].content.parts[0].text;

}


// ----------- AI ACTIONS ----------------

async function summarizeArticle(text){

aiOutput.innerHTML = "Generating summary...";

const prompt = `Summarize this news in 5 bullet points:\n${text}`;

const result = await callGemini(prompt);

aiOutput.innerHTML = result;

}


async function explainArticle(text){

aiOutput.innerHTML = "Explaining...";

const prompt = `Explain this news in simple language:\n${text}`;

const result = await callGemini(prompt);

aiOutput.innerHTML = result;

}


async function debateArticle(text){

aiOutput.innerHTML = "Generating debate points...";

const prompt = `Give arguments FOR and AGAINST this topic:\n${text}`;

const result = await callGemini(prompt);

aiOutput.innerHTML = result;

}


async function quizArticle(text){

aiOutput.innerHTML = "Generating quiz...";

const prompt = `Create 5 quiz questions with answers based on this news:\n${text}`;

const result = await callGemini(prompt);

aiOutput.innerHTML = result;

}


async function askAI(){

const question = prompt("Ask anything about global news:");

if(!question) return;

aiOutput.innerHTML = "Thinking...";

const result = await callGemini(question);

aiOutput.innerHTML = result;


}
