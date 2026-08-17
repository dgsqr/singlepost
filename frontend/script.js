const API_URL = "https://singlepost-ets0.onrender.com";
const headerDate = document.getElementById("current-date");

document.addEventListener("DOMContentLoaded", () => {
  getPosts();

  const userBlocked = JSON.parse(localStorage.getItem("blocked"));

  if (userBlocked) {
    formBlockerContainer.style.display = "flex";
    formContainer.classList.add("user-blocked");
  }
});

headerDate.textContent = new Date().toLocaleDateString("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function changeTab(tab) {
  const newPostContainer = document.getElementById("new-post-container");
  const feedContainer = document.getElementById("feed-container");

  const newPostBtnHeader = document.getElementById("new-post-btn");
  const feedBtnHeader = document.getElementById("feed-btn");

  if (tab === "feed") {
    feedBtnHeader.classList.add("active-btn");
    newPostBtnHeader.classList.remove("active-btn");

    feedContainer.style.display = "block";
    newPostContainer.style.display = "none";
  } else {
    feedBtnHeader.classList.remove("active-btn");
    newPostBtnHeader.classList.add("active-btn");

    feedContainer.style.display = "none";
    newPostContainer.style.display = "block";
  }
}

const formBlockerContainer = document.getElementById("form-blocker");
const formContainer = document.getElementById("form-container");
const mainForm = document.getElementById("main-form");
mainForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

const inputUsername = document.getElementById("username");
const inputContent = document.getElementById("content");
const postBtn = document.getElementById("post-btn");

function inputValidation() {
  if (inputUsername.value.length > 2 && inputContent.value.length > 2) {
    postBtn.disabled = false;
  } else {
    postBtn.disabled = true;
  }
}

inputUsername.addEventListener("input", () => {
  inputValidation();

  if (inputUsername.value > 30) inputUsername.value.slie(0, 30);
});

inputContent.addEventListener("input", () => {
  inputValidation();

  const letterCount = document.getElementById("letter-count");

  letterCount.innerHTML = `${200 - inputContent.value.length} left`;

  if (inputContent.value > 200) inputContent.value.slie(0, 200);
});

async function sendPost() {
  postBtn.textContent = "Uploading...";
  try {
    const postBody = {
      username: inputUsername.value.trim(),
      content: inputContent.value.trim(),
    };

    const response = await fetch(`${API_URL}/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postBody),
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.setItem("blocked", true);
        formBlockerContainer.style.display = "flex";
        formContainer.classList.add("user-blocked");
      } else {
        formBlockerContainer.style.display = "none";
        formContainer.classList.remove("user-blocked");
      }
    }

    inputUsername.value = "";
    inputContent.value = "";

    const data = await response.json();

    window.location.reload();
  } catch (error) {
    console.log(error);

    document.getElementById("new-post-h2").textContent = "Something went wrong";
    document.getElementById("new-post-subtitle").textContent =
      "Please, try again later.";

    document.getElementById("new-post-h2").style.color = "rgb(255, 68, 68)";
    document.getElementById("new-post-subtitle").style.color =
      "rgb(255, 68, 68)";
  } finally {
    postBtn.textContent = "Post";
  }
}
postBtn.addEventListener("click", () => {
  sendPost();
  postBtn.disabled = true;
});

async function getPosts() {
  const feedCardsContainer = document.getElementById("feed-cards");

  try {
    const response = await fetch(`${API_URL}/posts`);
    const data = await response.json();

    feedCardsContainer.innerHTML = "";

    data.posts.forEach((post) => {
      const div = document.createElement("div");
      div.classList.add("post");
      div.innerHTML = `
        <div
          class="post-details"
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <p>@${post.username}</p>
          <p>${post.createdAt.slice(11, 16)}</p>
        </div>
        <p class="post-content">
          ${post.content}
        </p>
    `;
      feedCardsContainer.appendChild(div);
    });
  } catch (error) {
    console.log(error);

    feedCardsContainer.innerHTML = "";

    const div = document.createElement("div");
    div.classList.add("error-post");
    div.innerHTML = `
          <p>Something went wrong.</p>
          <p>Please, try again later.</p>
    `;
    feedCardsContainer.appendChild(div);
  }
}

async function wakeServer() {
  try {
    const response = await fetch(`${API_URL}/ping`);
    const data = await response.json();

    console.log(data.message);
  } catch (error) {
    console.log(error);
  }
}
wakeServer();
