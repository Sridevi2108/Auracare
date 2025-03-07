document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.querySelector(".login");
    const sign_in_btn = document.querySelector("#sign-in-btn");
    const sign_up_btn = document.querySelector("#sign-up-btn");
    const container = document.querySelector(".container");

    // Redirect to login page when clicking login on homepage
    if (loginButton) {
        loginButton.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "login.html"; // Redirect to login page
        });
    }

    // Only redirect to chat.html if we're NOT on login.html
    if (localStorage.getItem("token") && !window.location.href.includes("login.html")) {
        window.location.href = "chat.html";
    }

    // Toggle between Sign-Up and Sign-In modes
    if (sign_up_btn && sign_in_btn && container) {
        sign_up_btn.addEventListener("click", () => container.classList.add("sign-up-mode"));
        sign_in_btn.addEventListener("click", () => container.classList.remove("sign-up-mode"));
    }

    // Handle Sign Up
    const signUpForm = document.querySelector(".sign-up-form");
    if (signUpForm) {
        signUpForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.querySelector("#signup-username").value.trim();
            const email = document.querySelector("#signup-email").value.trim();
            const password = document.querySelector("#signup-password").value.trim();
            const registerMessage = document.querySelector("#register-message");

            if (!username || !email || !password) {
                registerMessage.textContent = "All fields are required!";
                return;
            }

            try {
                const response = await fetch("http://127.0.0.1:5000/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password }),
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Registration failed");

                alert(data.message);
                container.classList.remove("sign-up-mode"); // Switch to Sign-In mode

            } catch (error) {
                registerMessage.textContent = error.message;
            }
        });
    }

    // Handle Sign In
    const signInForm = document.querySelector(".sign-in-form");
    if (signInForm) {
        signInForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.querySelector("#signin-username").value.trim();
            const password = document.querySelector("#signin-password").value.trim();
            const loginMessage = document.querySelector("#login-message");

            if (!username || !password) {
                loginMessage.textContent = "All fields are required!";
                return;
            }

            try {
                const response = await fetch("http://127.0.0.1:5000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Invalid credentials");

                alert(data.message);
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    window.location.href = "chat.html"; // Redirect to chat.html after login
                }

            } catch (error) {
                loginMessage.textContent = error.message;
            }
        });
    }

    // Handle Logout (on chat.html)
    const logoutButton = document.querySelector("#logout");
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.href = "login.html"; // Redirect to login after logout
        });
    }
});
