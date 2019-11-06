// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

document.addEventListener("DOMContentLoaded", ()=>{
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(response=>response.json())
    .then(quoteArr => quoteArr.forEach(quote=>renderQuote(quote)))

    quoteForm().addEventListener("submit", createQuote)
})

function quoteList(){
    return document.getElementById("quote-list")
}

function quoteForm(){
    return document.getElementById("new-quote-form")
}

function renderQuote(quote){
    const quoteCard = document.createElement("li")
    quoteCard.classList.add("quote-card")
    quoteCard.dataset.quoteId = quote.id

    const blockQuote = document.createElement("blockquote")
    blockQuote.classList.add("blockquote")

    const quoteContent = document.createElement("p")
    quoteContent.classList.add("mb-0")
    quoteContent.innerText= quote.quote

    const author = document.createElement("footer")
    author.classList.add("blockquote-footer")
    author.innerText=quote.author

    const lineBreak = document.createElement("br")
    
    // const likeButton = document.createElement("button")
    // const likes = document.createElement("span")
    // likes.innerText= quote.likes.length
    // likeButton.classList.add("btn-success")
    // likeButton.innerhtml = `Likes: ${likes}`

    let numLikes = quote.likes ? quote.likes.length : 0

    const likeButton = document.createElement("button")
    likeButton.classList.add("btn-success")
    likeButton.dataset.quote = quote.id
    likeButton.innerHTML = `Likes: <span>${numLikes}</span>`
    likeButton.addEventListener("click", addLike)

    const deleteButton = document.createElement("button")
    deleteButton.classList.add("btn-danger")
    deleteButton.innerText = "Delete"
    deleteButton.addEventListener("click", deleteQuote)

    quoteList().appendChild(quoteCard)
    quoteCard.appendChild(blockQuote)
    blockQuote.appendChild(quoteContent)
    blockQuote.appendChild(author)
    blockQuote.appendChild(lineBreak)
    blockQuote.appendChild(likeButton)
    blockQuote.appendChild(deleteButton)
}

function createQuote(event){
    event.preventDefault()
    const quoteContent = document.getElementById("new-quote").value
    const quoteAuthor = document.getElementById("author").value

    const quoteData = {quote: quoteContent, author: quoteAuthor}

    const configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(quoteData)
    }

    fetch("http://localhost:3000/quotes", configObj)
    .then(response=>response.json())
    .then(quote=>renderQuote(quote))
}

function deleteQuote(event){
    const quoteCard = event.target.parentElement.parentElement
    const quoteId = quoteCard.dataset.quoteId

    const objectConfig = {
        method: "DELETE",

    }

    fetch(`http://localhost:3000/quotes/${quoteId}`, objectConfig)
    .then(response => response.json())
    .then(deletedQuote=> alert("Quote GONE"))

    quoteCard.remove()
}

function addLike(event){
    //manipulated the DOM
    event.target.firstElementChild.innerText = Number(event.target.firstElementChild.innerText) + 1

    //fetch the quote id
    const quoteId = Number(event.target.dataset.quote)


    const data = {
        quoteId: quoteId
    }

    const configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
    }

    //update the like index
    fetch("http://localhost:3000/likes", configObj)
    .then(response=>response.json())
    .then(likesObj=> console.log(likesObj))
}