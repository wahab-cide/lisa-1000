async function generateStory(prompt) {
    console.log('Contacting OpenAI server with prompt:', prompt); // Debugging code

    try {
        const response = await fetch('/generate-story', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: prompt })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Received story from server:', data.story); // Debugging code
        console.log('Received image URL from server:', data.imageUrl); // Debugging code

        // Use the generateDallEPrompt function with the received story
        const dallEPrompt = generateDallEPrompt(data.story);
        console.log('Generated DALL-E prompt:', dallEPrompt); // Debugging code

        return data;
    } catch (error) {
        console.error('Network or server error:', error);
        return null;
    }
}

// Function to generate a text DALL-E prompt from the story
async function generateDallEPrompt(story) {
    try {
        if (!story || typeof story !== 'string') {
            throw new Error('Invalid story input');
        }

        const response = await fetch('/generate-dalle-prompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ story: story })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const data = await response.json();

        // Check if the response contains the expected structure
        if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
            throw new Error('Invalid response format');
        }

        const prompt = data.choices[0].message.content;
        console.log('Generated DALL-E prompt:', prompt); // Debugging code
        return prompt;
    } catch (error) {
        console.error('Error generating DALL-E prompt:', error);
        return ''; // Return an empty string in case of an error
    }
}



document.addEventListener('DOMContentLoaded', function() {
    const takeMattersButton = document.getElementById('takeMattersButton');
    const buttonContainer = document.getElementById('button-container');
    const generateStoryButton = document.getElementById('generateStoryButton');
    const generateMyStoryButton = document.getElementById('generateMyStoryButton');
    const randomStoryButton = document.getElementById('randomStoryButton');
    const fineTuneButton = document.getElementById('fineTuneButton');
    const generateFineTunedStoryButton = document.getElementById('generateFineTunedStoryButton');
    const generateStoryForm = document.getElementById('generateStoryForm');
    const readButton = document.getElementById('readButton');
    const translateButton = document.getElementById('translateButton');
    const animateButton = document.getElementById('animateButton');
    const narrateButton = document.getElementById('narrateButton');
    const voiceDropdown = document.getElementById('voiceDropdown');
    
    const takeMattersSection = document.getElementById('take-matters-section');
    const generateStorySection = document.getElementById('generate-story-section');
    const fineTuneOptions = document.getElementById('fineTuneOptions');
    const storyContainer = document.getElementById('c-story-container');
    
    let selectedVoice = '';

    voiceDropdown.addEventListener('change', function() {
        selectedVoice = voiceDropdown.value;
        console.log(`Selected voice: ${selectedVoice}`);
    });

    function displayStory(story, imageUrl, title = 'Generated Story') {
        if (!story) {
            storyContainer.innerHTML = '<h2>Failed to generate story</h2>';
            return;
        }
        console.log('Displaying story:', story); // Debugging code
        console.log('Displaying image URL:', imageUrl); // Debugging code

        storyContainer.innerHTML = `
            <h2>${title}</h2>
            <img src="${imageUrl}" alt="Generated Image" class="generated-image" style="max-width: 100%; height: auto; border-radius: 10px; margin-bottom: 20px;">
            <p id="story-content">${story}</p>`;
        storyContainer.style.backgroundColor = '#f0f8ff'; // Light blue background
        storyContainer.style.padding = '20px';
        storyContainer.style.border = '2px solid #000';
        storyContainer.style.borderRadius = '10px';
        storyContainer.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        storyContainer.style.transition = 'background-color 0.5s ease, background-image 1s ease-in-out'; // Smooth transition for background color and image
        storyContainer.style.opacity = '0';
        setTimeout(() => {
            storyContainer.style.opacity = '1';
        }, 10); // Small timeout to trigger fade-in effect
            // Ask reflective questions
    askReflectiveQuestions();
    }

    takeMattersButton.addEventListener('click', function() {
        console.log('Lisa\'s Story button clicked'); // Debugging code
        takeMattersSection.style.display = 'block';
        generateStorySection.style.display = 'none';
    });

    generateStoryButton.addEventListener('click', function() {
        console.log('Generate Story button clicked'); // Debugging code
        takeMattersSection.style.display = 'none';
        generateStorySection.style.display = 'block';
    });

    randomStoryButton.addEventListener('click', async function() {
        console.log('Completely Random button clicked'); // Debugging code
        const lengthOptions = ["short", "very short", "super short"];
        const genreOptions = ["fantasy", "mystery", "adventure", "science fiction", "historical"];
        const randomLength = lengthOptions[Math.floor(Math.random() * lengthOptions.length)];
        const randomGenre = genreOptions[Math.floor(Math.random() * genreOptions.length)];
        const storyData = await generateStory(`Write a ${randomLength} ${randomGenre} story suitable for language learning alongside a highly detailed relevant imagePrompt for DallE: Your text output is: story|imagePrompt`);
        if (storyData) {
            displayStory(storyData.story, storyData.imageUrl, `Generated ${randomGenre} Story`);
            buttonContainer.style.display = 'flex';
        }
    });

    fineTuneButton.addEventListener('click', function() {
        console.log('Fine Tune button clicked'); // Debugging code
        fineTuneOptions.style.display = 'block';
    });

    generateFineTunedStoryButton.addEventListener('click', async function() {
        const genre = document.getElementById('genre').value;
        const length = document.getElementById('length').value;
        const characterNum = document.getElementById('characterNum').value;
        const emotion = document.getElementById('emotion').value;
        const language = document.getElementById('language').value;
    
        const prompt = `Write a ${length} story with ${characterNum} characters (participants) in the ${language} language leaving you ${emotion} in the end. Alongside a highly detailed relevant imagePrompt for DallE: Your text output is: story|imagePrompt`;
        console.log(`Generating a story with prompt: ${prompt}`); // Debugging code
        const storyData = await generateStory(prompt);
        if (storyData) {
            displayStory(storyData.story, storyData.imageUrl, `Generated ${genre} Story`);
            buttonContainer.style.display = 'flex';
        }
    });
    

    generateStoryForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        console.log('Generate Story form submitted'); // Debugging code
        const title = document.getElementById('title').value;
        const theme = document.getElementById('theme').value;
        const inputLanguage = document.getElementById('inputLanguage').value;
        const textInput = document.getElementById('textInput').value;
        const outputLanguage = document.getElementById('outputLanguage').value;
        const music = document.getElementById('music').checked;
        const scenery = document.getElementById('scenery').checked;
        const video = document.getElementById('video').checked;
        const subtitles = document.getElementById('subtitles').checked;

        const prompt = `Title: ${title}, Theme: ${theme}, Input Language: ${inputLanguage}, Text: ${textInput}, outputLanguage: ${outputLanguage}, Music: ${music}, alongside a highly detailed relevant imagePrompt for DallE: Your text output is: story|imagePrompt`;
        console.log(`Generating a story with prompt: ${prompt}`); // Debugging code
        const storyData = await generateStory(prompt);
        if (storyData) {
            displayStory(storyData.story, storyData.imageUrl, title);
            buttonContainer.style.display = 'flex';
        }
    });

    readButton.addEventListener('click', function() {
        const storyText = document.getElementById('story-content').textContent;
        readStoryAloud(storyText, selectedVoice);
    });

    translateButton.addEventListener('click', async function() {
        const storyText = document.getElementById('story-content').textContent;
        const selectedLanguage = document.getElementById('nativeLanguage').value;
        if (selectedLanguage !== 'I speak...') {
            const translatedStory = await translateText(storyText, selectedLanguage);
            displayStory(translatedStory, storyData.imageUrl, "Translated Story");
        }
    });

    animateButton.addEventListener('click', function() {
        console.log('Animate button clicked'); // Debugging code
    });

    narrateButton.addEventListener('click', function() {
        const storyText = document.getElementById('story-content').textContent;
        readStoryAloud(storyText, selectedVoice);
    });

    // Function to read the story aloud
    async function readStoryAloud(text, voice) {
        try {
            const response = await fetch('/generate-speech', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: text, voice: voice })
            });
    
            if (voice) {
                const data = await response.json();
                const audioUrl = data.audioUrl;
                const audio = new Audio(audioUrl);
                audio.play();
            } else {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const audio = new Audio(url);
                audio.play();
            }
        } catch (error) {
            console.error('Error reading story aloud:', error);
        }
    }
    
// Function to fetch the definition of a word
async function defineText(word) {
    try {
        const response = await fetch('/definition', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ word: word })
        });
        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }
        const data = await response.json();
        return data.definition;
    } catch (error) {
        console.error('Error getting definition:', error);
        return null;
    }
}

// Function to translate text
async function translateText(text, targetLanguage) {
    try {
        const response = await fetch('/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: text, targetLanguage: targetLanguage })
        });
        const data = await response.json();
        return data.translatedText;
    } catch (error) {
        console.error('Error translating text:', error);
        return null;
    }
}


// Function to handle double-click event on text
async function handleDoubleClick(event) {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        const definition = await defineText(selectedText);
        const translationToggle = document.getElementById('translation-toggle').classList.contains('active');
        let translation = '';
        if (translationToggle) {
            const targetLanguage = document.getElementById('nativeLanguage').value;
            if (targetLanguage !== 'default') {
                translation = await translateText(selectedText, targetLanguage);
            }
        }

        const popupContent = `
            <h2>Definition</h2>
            <p>${definition}</p>
            ${translation ? `<h2>Translation</h2><p>${translation}</p>` : ''}
        `;
        showPopup(popupContent);
    }
}
// Function to show popup with content
function showPopup(content) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <span class="close-btn">&times;</span>
            ${content}
        </div>
    `;
    document.body.appendChild(popup);

    const closeButton = popup.querySelector('.close-btn');
    closeButton.addEventListener('click', () => {
        popup.remove();
    });
}
// Event listener for double-click on story content
document.addEventListener('dblclick', handleDoubleClick);

// Event listener for translation toggle
document.getElementById('translation-toggle').addEventListener('click', function() {
    this.classList.toggle('active');
    console.log('Translation toggle:', this.classList.contains('active'));
});
function askReflectiveQuestions() {
    const questions = [
        'What did you learn from the story?',
        'How did the story make you feel?',
        'Can you relate any part of the story to your own life?',
        'What was your favorite part of the story and why?',
        'If you could change one thing in the story, what would it be?',
        'How does this help in your language learning goals?'
    ];

    const questionContainer = document.createElement('div');
    questionContainer.className = 'question-container';

    questions.forEach(question => {
        const questionElement = document.createElement('p');
        questionElement.textContent = question;
        questionContainer.appendChild(questionElement);
    });

    storyContainer.appendChild(questionContainer);
}
});