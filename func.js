const API_URL = "http://localhost:3000/posts";
let currentPostId = null;

// DOM Elements
const postsContainer = document.getElementById("posts-container");
const postDetailSection = document.getElementById("post-detail");
const postForm = document.getElementById("post-form");

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  fetchPosts();
  setupEventListeners();
});

// Fetch all posts from the API
async function fetchPosts() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch posts");
    const posts = await response.json();
    renderPosts(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    alert("Failed to load posts. Please try again later.");
  }
}

// Render posts in the UI
function renderPosts(posts) {
  postsContainer.innerHTML = "";
  posts.forEach(post => {
    const postCard = document.createElement("div");
    postCard.className = "post-card";
    postCard.innerHTML = `
      <h3>${post.title}</h3>
      <p><em>By ${post.author}</em></p>
    `;
    postCard.addEventListener("click", () => showPostDetails(post));
    postsContainer.appendChild(postCard);
  });
}

// Show detailed view of a post
function showPostDetails(post) {
  currentPostId = post.id;
  document.getElementById("detail-title").textContent = post.title;
  document.getElementById("detail-content").textContent = post.content;
  document.getElementById("detail-author").textContent = `By ${post.author}`;
  postDetailSection.classList.remove("hidden");
  
  // Set up delete button listener here when the button is visible
  document.getElementById("delete-button").addEventListener("click", handleDeletePost);
}

// Handle post deletion
async function handleDeletePost() {
  if (!currentPostId) return;
  
  if (!confirm("Are you sure you want to delete this post?")) return;
  
  try {
    const response = await fetch(`${API_URL}/${currentPostId}`, {
      method: "DELETE"
    });
    
    if (!response.ok) throw new Error("Failed to delete post");
    
    postDetailSection.classList.add("hidden");
    fetchPosts();
    currentPostId = null;
  } catch (error) {
    console.error("Error deleting post:", error);
    alert("Failed to delete post. Please try again.");
  }
}

// Handle new post submission
async function handleFormSubmit(event) {
  event.preventDefault();
  
  const title = document.getElementById("post-title").value.trim();
  const content = document.getElementById("post-content-input").value.trim();
  const author = document.getElementById("post-author").value.trim();

  // Validate form inputs
  if (!title || !content || !author) {
    alert("Please fill in all fields");
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, author })
    });
    
    if (!response.ok) throw new Error("Failed to create post");
    
    postForm.reset();
    fetchPosts();
  } catch (error) {
    console.error("Error creating post:", error);
    alert("Failed to create post. Please try again.");
  }
}

// Set up all event listeners
function setupEventListeners() {
  // Form submission handler
  postForm.addEventListener("submit", handleFormSubmit);
  
  // Note: Delete button listener is now set up in showPostDetails
}