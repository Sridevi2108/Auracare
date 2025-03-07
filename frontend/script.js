document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");

    function appendMessage(sender, message) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add(sender === "user" ? "user-message" : "bot-message");
        messageDiv.textContent = message;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function sendMessage() {
        const message = userInput.value.trim();
        if (message === "") return;

        appendMessage("user", message);
        userInput.value = "";

        fetch("http://localhost:5005/webhooks/rest/webhook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sender: "user", message: message }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                data.forEach(botResponse => {
                    appendMessage("bot", botResponse.text);
                });
            } else {
                appendMessage("bot", "I'm not sure how to respond to that.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            appendMessage("bot", "There was an error connecting to the chatbot.");
        });
    }

    document.querySelector("button").addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});
