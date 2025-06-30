// API Base URL
const API_URL = "http://localhost:3000/posts";

// DOM Elements
const postsContainer = document.getElementById("posts-container");
const postDetailSection = document.getElementById("post-content");
const postForm = document.getElementById("post-form");
const deleteButton = document.getElementById("delete-button");

// State
let currentPostId = null;

// Initialize the application
function init() {
  fetchPosts();
  setupEventListeners();
}

// Fetch all posts from API
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
    postCard.addEventListener("click", () => showPostDetails(post.id));
    postsContainer.appendChild(postCard);
  });
}

// Show detailed view of a post
async function showPostDetails(postId) {
  try {
    const response = await fetch(`${API_URL}/${postId}`);
    if (!response.ok) throw new Error("Failed to fetch post details");
    
    const post = await response.json();
    currentPostId = post.id;
    
    postDetailSection.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <p><strong>Author:</strong> ${post.author}</p>
      <button id="delete-button">Delete Post</button>
    `;
    
    // Add event listener to the newly created delete button
    document.getElementById("delete-button").addEventListener("click", handleDeletePost);
  } catch (error) {
    console.error("Error fetching post details:", error);
    alert("Failed to load post details. Please try again.");
  }
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
    
    postDetailSection.innerHTML = "";
    currentPostId = null;
    fetchPosts(); // Refresh the post list
  } catch (error) {
    console.error("Error deleting post:", error);
    alert("Failed to delete post. Please try again.");
  }
}

// Handle new post submission
async function handleFormSubmit(event) {
  event.preventDefault();
  
  const title = document.getElementById("post-title").value;
  const content = document.getElementById("post-content-input").value;
  const author = document.getElementById("post-author").value;

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
    fetchPosts(); // Refresh the post list
  } catch (error) {
    console.error("Error creating post:", error);
    alert("Failed to create post. Please try again.");
  }
}

// Set up all event listeners
function setupEventListeners() {
  postForm.addEventListener("submit", handleFormSubmit);
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", init);