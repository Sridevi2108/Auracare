document.getElementById('send-btn').addEventListener('click', function() {
    sendMessage();
});

document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

document.getElementById('new-chat-btn').addEventListener('click', function() {
    newChat();
});

document.getElementById('emoji-btn').addEventListener('click', function() {
    toggleEmojiPicker();
});

// Initialize Emoji Picker
let picker = null;

async function initializeEmojiPicker() {
    const pickerContainer = document.getElementById('emoji-picker');
    picker = await new EmojiMart.Picker({
        data: async () => {
            const response = await fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data');
            return response.json();
        },
        onEmojiSelect: (emoji) => {
            const userInput = document.getElementById('user-input');
            userInput.value += emoji.native;
            pickerContainer.style.display = 'none'; // Hide picker after selection
        },
        categories: ['frequent', 'people', 'nature', 'foods', 'activity', 'places', 'objects', 'symbols', 'flags'],
        custom: [
            {
                name: 'Frequently used',
                emojis: ['😀', '😂', '❤️', '👍', '👋', '🎉', '🙏', '🔥'],
            },
        ],
    });
    pickerContainer.appendChild(picker);
}

function toggleEmojiPicker() {
    const pickerContainer = document.getElementById('emoji-picker');
    if (pickerContainer.style.display === 'none' || !pickerContainer.style.display) {
        pickerContainer.style.display = 'block';
    } else {
        pickerContainer.style.display = 'none';
    }
}

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');

    // Store the message value before clearing the input
    const messageText = userInput.value.trim();

    if (messageText !== '') {
        // Create and display the user's message
        const userMessage = document.createElement('div');
        userMessage.classList.add('message', 'user-message');

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = messageText;

        const messageTime = document.createElement('div');
        messageTime.classList.add('message-time');
        messageTime.textContent = getCurrentTime();

        userMessage.appendChild(messageContent);
        userMessage.appendChild(messageTime);
        chatBox.appendChild(userMessage);
        chatBox.scrollTop = chatBox.scrollHeight;

        // Clear the input field after storing the message
        userInput.value = '';

        try {
            // Send the stored message to Rasa
            const response = await fetchRasaResponse(messageText);

            // Create and display the bot's response
            const botMessage = document.createElement('div');
            botMessage.classList.add('message', 'bot-message');

            const botMessageContent = document.createElement('div');
            botMessageContent.classList.add('message-content');
            botMessageContent.textContent = response;

            const botMessageTime = document.createElement('div');
            botMessageTime.classList.add('message-time');
            botMessageTime.textContent = getCurrentTime();

            botMessage.appendChild(botMessageContent);
            botMessage.appendChild(botMessageTime);
            chatBox.appendChild(botMessage);
            chatBox.scrollTop = chatBox.scrollHeight;
        } catch (error) {
            console.error("Error fetching response from Rasa:", error);
            const botMessage = document.createElement('div');
            botMessage.classList.add('message', 'bot-message');

            const botMessageContent = document.createElement('div');
            botMessageContent.classList.add('message-content');
            botMessageContent.textContent = "Sorry, I couldn't process your request. Please try again.";

            const botMessageTime = document.createElement('div');
            botMessageTime.classList.add('message-time');
            botMessageTime.textContent = getCurrentTime();

            botMessage.appendChild(botMessageContent);
            botMessage.appendChild(botMessageTime);
            chatBox.appendChild(botMessage);
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }
}

async function fetchRasaResponse(message) {
    const rasaServerUrl = 'http://localhost:5005/webhooks/rest/webhook'; // Replace with your Rasa server URL

    try {
        const response = await fetch(rasaServerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sender: 'user', // Unique sender ID for the user
                message: message,
            }),
        });

        if (!response.ok) {
            throw new Error(`Rasa server returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Response from Rasa:", data); // Debugging log

        if (data.length > 0 && data[0].text) {
            return data[0].text; // Return the bot's response
        } else {
            throw new Error("No valid response from Rasa.");
        }
    } catch (error) {
        console.error("Error fetching Rasa response:", error);
        throw error;
    }
}

function newChat() {
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = '<div class="message bot-message"><div class="message-content">Hello! How can I help you today?</div><div class="message-time">' + getCurrentTime() + '</div></div>';
}

function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
}

// Initialize Emoji Picker on page load
initializeEmojiPicker();