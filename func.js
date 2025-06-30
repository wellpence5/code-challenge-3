//GLOBALS (not ideal but works)
let allPosts = [];
const API_URL = "http://localhost:3000/posts";

// MAIN FUNCTION (runs on load)
function main() {
  loadPosts(); // First load
  setupForm();
}

//FETCH POSTS
function loadPosts() {
  fetch(API_URL)
    .then(res => res.json())
    .then(posts => {
      allPosts = posts;
      renderPosts(posts);
    })
}
// RENDER POSTS
function renderPosts(posts) {
  const container = document.getElementById("posts-container");
  container.innerHTML = ""; // Clear old posts
  
  // Looping with forEach + index (could use map)
  posts.forEach((post, index) => {
    const card = document.createElement("div");
    card.className = "post-card";
    card.innerHTML = `
      <h3>${post.title}</h3>
      <p><em>By ${post.author}</em></p>
    `;
    
    // Adding click listener (inline function)
    card.addEventListener("click", function() {
      showPostDetails(post.id);
    });
    
    container.appendChild(card);
  });
}

//SHOW POST DETAILS
function showPostDetails(postId) {
  fetch(`${API_URL}/${postId}`)
    .then(res => res.json())
    .then(post => {
      document.getElementById("detail-title").textContent = post.title;
      document.getElementById("detail-content").textContent = post.content;
      document.getElementById("detail-author").textContent = `By ${post.author}`;
      document.getElementById("post-detail").style.display = "block";
    })
    .catch(err => console.log("Error fetching post:", err));
}

//FORM HANDLING
function setupForm() {
  document.getElementById("new-post-form").addEventListener("submit", function(e) {
    e.preventDefault();
    addNewPost();
  });
}

// ADD NEW POST
function addNewPost() {
  const title = document.getElementById("title-input").value;
  const content = document.getElementById("content-input").value;
  const author = document.getElementById("author-input").value;
  
  const newPost = { 
    id: allPosts.length + 1, 
    title, 
    content, 
    author 
  };
  
  allPosts.push(newPost);
  renderPosts(allPosts);
  
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPost),
  })
  .then(res => res.json())
  .then(data => console.log("Success:", data))
  .catch(err => console.log("Error saving:", err));
  
  // Clearing form
  document.getElementById("new-post-form").reset();
}

//START APP
document.addEventListener("DOMContentLoaded", main);