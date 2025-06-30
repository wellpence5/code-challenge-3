// API configuration
// Base URL for our mock API (using JSON Server)
const API_URL = "http://localhost:3000/posts";

// Variable to keep track of which post is currently being viewed
let currentPostId = null;

// DOM Elements
// Cache references to key elements we'll manipulate
const postsContainer = document.getElementById("posts-container");
const postDetailSection = document.getElementById("post-detail");
const postForm = document.getElementById("post-form");

// Initialize the application when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Fetch and display all posts when page loads
  fetchPosts();
  
  // Set up all event listeners
  setupEventListeners();
});

/**
 * Fetches all posts from the API and displays them
 * Handles any errors that occur during the fetch
 */
async function fetchPosts() {
  try {
    // Make GET request to API
    const response = await fetch(API_URL);
    
    // Check if response was successful (status code 200-299)
    if (!response.ok) throw new Error("Failed to fetch posts");
    
    // Parse JSON response
    const posts = await response.json();
    
    // Render the posts in the UI
    renderPosts(posts);
  } catch (error) {
    // Log error to console for debugging
    console.error("Error fetching posts:", error);
    
    // Show user-friendly error message
    alert("Failed to load posts. Please try again later.");
  }
}

/**
 * Renders an array of posts in the UI
 * @param {Array} posts - Array of post objects to render
 */
function renderPosts(posts) {
  // Clear any existing posts from the container
  postsContainer.innerHTML = "";
  
  // Create and append a card for each post
  posts.forEach(post => {
    // Create card container element
    const postCard = document.createElement("div");
    postCard.className = "post-card";
    
    // Set card content (title and author)
    postCard.innerHTML = `
      <h3>${post.title}</h3>
      <p><em>By ${post.author}</em></p>
    `;
    
    // Add click handler to show post details when clicked
    postCard.addEventListener("click", () => showPostDetails(post));
    
    // Add card to the container
    postsContainer.appendChild(postCard);
  });
}

/**
 * Displays detailed view of a single post
 * @param {Object} post - The post object to display
 */
function showPostDetails(post) {
  // Store the post ID for possible deletion
  currentPostId = post.id;
  
  // Update the detail section with post data
  document.getElementById("detail-title").textContent = post.title;
  document.getElementById("detail-content").textContent = post.content;
  document.getElementById("detail-author").textContent = `By ${post.author}`;
  
  // Show the detail section (removes 'hidden' class)
  postDetailSection.classList.remove("hidden");
}

/**
 * Deletes the currently viewed post after confirmation
 */
async function deleteCurrentPost() {
  // Don't proceed if no post is selected
  if (!currentPostId) return;
  
  try {
    // Send DELETE request to API
    const response = await fetch(`${API_URL}/${currentPostId}`, {
      method: "DELETE"
    });
    
    // Check if deletion was successful
    if (!response.ok) throw new Error("Failed to delete post");
    
    // Hide the detail section
    postDetailSection.classList.add("hidden");
    
    // Refresh the post list to reflect deletion
    fetchPosts();
    
    // Reset the current post ID
    currentPostId = null;
  } catch (error) {
    // Log and display any errors
    console.error("Error deleting post:", error);
    alert("Failed to delete post. Please try again.");
  }
}

/**
 * Handles form submission for new posts
 * @param {Event} event - The form submission event
 */
async function handleFormSubmit(event) {
  // Prevent default form submission behavior
  event.preventDefault();
  
  // Get values from form inputs
  const title = document.getElementById("post-title").value
}