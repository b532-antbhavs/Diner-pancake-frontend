const host = "https://diner-pancake-backend-latest.onrender.com";
const menuDiv = document.getElementById("menu");
const menuContainer = document.getElementById("menu-container");
const loginContainer = document.getElementById("login-container");
const signupContainer = document.getElementById("signup-container");

// Navigation elements
const allMenuLink = document.getElementById("all-menu");
const breakfastLink = document.getElementById("breakfast");
const lunchLink = document.getElementById("lunch");
const dinnerLink = document.getElementById("dinner");
const vegetarianLink = document.getElementById("vegetarian");
const loginNavLink = document.getElementById("login-nav");

// Login/Signup elements
const signupLink = document.getElementById("signup-link");
const cancelBtn = document.getElementById("cancel-btn");
const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");

// Initialize the page
displayMergedMenu();

// Navigation event listeners
allMenuLink.addEventListener("click", () => {
    showView("menu");
    displayMergedMenu();
});

breakfastLink.addEventListener("click", () => {
    showView("menu");
    displayFilteredMenu("/breakfast", "Breakfast Menu");
});

lunchLink.addEventListener("click", () => {
    showView("menu");
    displayFilteredMenu("/lunch", "Lunch Menu");
});

dinnerLink.addEventListener("click", () => {
    showView("menu");
    displayFilteredMenu("/supper", "Dinner Menu");
});

vegetarianLink.addEventListener("click", () => {
    showView("menu");
    displayFilteredMenu("/vegetarian", "Vegetarian Menu");
});

loginNavLink.addEventListener("click", () => {
    showView("login");
});

// Login/Signup event listeners
signupLink.addEventListener("click", (e) => {
    e.preventDefault();
    showView("signup");
});

cancelBtn.addEventListener("click", () => {
    showView("login");
});

signupBtn.addEventListener("click", async () => {
    const email = document.getElementById("signup-email").value;
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    if (!email || !username || !password) {
        alert("Please fill in all fields");
        return;
    }

    try {
        const response = await fetch(`${host}/merger/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password, email })
        });

        if (response.ok) {
            alert("Registration successful!");
            showView("login");
            // Clear form
            document.getElementById("signup-email").value = "";
            document.getElementById("signup-username").value = "";
            document.getElementById("signup-password").value = "";
        } else {
            const error = await response.text();
            alert(`Registration failed: ${error}`);
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});

loginBtn.addEventListener("click", () => {
    // For now, just show a message
    alert("Login functionality will be implemented later");
});

// Helper functions
function showView(view) {
    menuContainer.classList.add("hidden");
    loginContainer.classList.add("hidden");
    signupContainer.classList.add("hidden");

    if (view === "menu") {
        menuContainer.classList.remove("hidden");
    } else if (view === "login") {
        loginContainer.classList.remove("hidden");
    } else if (view === "signup") {
        signupContainer.classList.remove("hidden");
    }
}

async function getMenuItems(endpoint = "") {
    const response = await fetch(`${host}/merger${endpoint}`);
    return await response.json();
}

async function displayMergedMenu() {
    const menu = await getMenuItems();
    displayMenuItems(menu, "Combined Menu");
}

async function displayFilteredMenu(endpoint, title) {
    const menu = await getMenuItems(endpoint);
    displayMenuItems(menu, title);
}

function displayMenuItems(menu, title) {
    menuDiv.innerHTML = "";
    const h1 = document.createElement("h1");
    h1.textContent = title;
    menuDiv.prepend(h1);

    for (let menuItem of menu) {
        let div = document.createElement("div");
        div.className = "menu-item";
        div.innerHTML = `
            <div class="item-name">${menuItem.name}</div>
            <div class="item-description">${menuItem.description}</div>
            <div class="item-price">$${menuItem.price.toFixed(2)}</div>
            ${menuItem.vegetarian ? '<div class="veg-indicator">Vegetarian</div>' : ''}
        `;
        menuDiv.appendChild(div);
    }
}