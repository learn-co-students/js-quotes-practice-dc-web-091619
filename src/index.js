document.addEventListener("DOMContentLoaded", () => {

  const container = document.createElement("ul");
  container.classList.add("quotes-container")
  document.querySelector("body").appendChild(container);

  fetch("http://localhost:3000/quotes?_embed=likes")
  .then(res => res.json())
  .then(quotes => quotes.forEach(quote => renderQuote(quote)))

  form.addEventListener("submit", formSubmitted)
  
})
const form = document.getElementById("new-quote-form")

function renderQuote(quo) {
  const quotesContainer = document.querySelector(".quotes-container")
  const quoteCard = document.createElement("li")
  quoteCard.classList.add("quote-card")
  quotesContainer.append(quoteCard)

  const blockQuote = document.createElement("blockquote")
  blockQuote.classList.add("blockquote")
  quoteCard.append(blockQuote)
  
  const pTag = document.createElement("p")
  pTag.classList.add("mb-0")
  pTag.innerText = quo.quote

  const footer = document.createElement("footer")
  footer.classList.add("blockquote-footer")
  footer.innerText = quo.author

  const likeButton = document.createElement("button")
  likeButton.classList.add("btn-success")
  likeButton.addEventListener("click", likeButtonClicked)
  if (quo.likes) {
  likeButton.innerHTML = `Likes: <span>${quo.likes.length}</span>`
  } else {likeButton.innerHTML = "Likes: <span>0</span>"}

  const deleteButton = document.createElement("button")
  deleteButton.classList.add("btn-danger")
  deleteButton.dataset.quoId = `${quo.id}`
  deleteButton.innerText = "Delete"
  deleteButton.addEventListener("click", deleteClicked)

  blockQuote.append(pTag, footer, likeButton, deleteButton)
}


function formSubmitted(event) {
  event.preventDefault()
  fetch("http://localhost:3000/quotes", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      quote: document.querySelector("#new-quote").value,
      author: document.querySelector("#author").value
    })
  })
  .then(res => res.json())
  .then(quote => renderQuote(quote))
  event.target.reset()
}


function deleteClicked(event) {
  const quoteId = parseInt(event.target.dataset.quoId, 10)
  fetch(`http://localhost:3000/quotes/${quoteId}`, {
    method: "DELETE"
  })
  .then(() => {document.getElementById(`quote-${parseInt(quoteId, 10)}`).remove()})
}


function likeButtonClicked(event) {
  const quoId = parseInt(event.target.nextSibling.dataset.quoId, 10)
  const time = Date.now()/1000
  const likeSpan = event.target.firstElementChild
  fetch("http://localhost:3000/likes", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      quoteId: quoId,
      createdAt: time
    })
  })
  .then(() => {likeSpan.innerText = parseInt(likeSpan.innerText, 10) + 1})
}