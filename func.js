// API Base URL
const API_URL = "http://localhost:3000/posts";

// DOM Elements
const postsContainer = document.getElementById("posts-container");
const postDetail = document.getElementById("post-content");
const postForm = document.getElementById("post-form");

// Main Function (Runs on DOM Load)
function main() {
  displayPosts();
  addNewPostListener();
}

// Fetch & Display All Posts
async function displayPosts() {
  try {
    const response = await fetch(API_URL);
    const posts = await response.json();
    renderPosts(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

// Render Posts in the UI
function renderPosts(posts) {
  postsContainer.innerHTML = "";
  posts.forEach(post => {
    const postCard = document.createElement("div");
    postCard.className = "post-card";
    postCard.innerHTML = `
      <h3>${post.title}</h3>
      <p><em>By ${post.author}</em></p>
    `;
    postCard.addEventListener("click", () => handlePostClick(post.id));
    postsContainer.appendChild(postCard);
  });
}

// Handle Post Click (Show Details)
async function handlePostClick(postId) {
  try {
    const response = await fetch(`${API_URL}/${postId}`);
    const post = await response.json();
    postDetail.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <p><strong>Author:</strong> ${post.author}</p>
    `;
  } catch (error) {
    console.error("Error fetching post details:", error);
  }
}

// Add New Post Listener
function addNewPostListener() {
  postForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const title = document.getElementById("post-title").value;
    const content = document.getElementById("post-content-input").value;
    const author = document.getElementById("post-author").value;

    const newPost = { title, content, author };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      const post = await response.json();
      displayPosts(); // Refresh the list
      postForm.reset(); // Clear form
    } catch (error) {
      console.error("Error creating post:", error);
    }
  });
}

// Initialize App When DOM Loads
document.addEventListener("DOMContentLoaded", main);