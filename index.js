const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultContainer = document.getElementById('result-container');
const errorMessage = document.getElementById('error-message');

let audio;

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const word = searchInput.value.trim();
    if (word) fetchWordData(word);
});

async function fetchWordData(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        
        if (!response.ok) throw new Error("Word not found");

        const data = await response.json();
        displayResults(data[0]);
    } catch (err) {
        showError(err.message);
    }
}

function displayResults(data) {
    errorMessage.classList.add('hidden');
    resultContainer.classList.remove('hidden');
     // Set Word and Phonetic
    document.getElementById('display-word').textContent = data.word;
    document.getElementById('phonetic').textContent = data.phonetic || "";

    // Handle Audio
    const audioUrl = data.phonetics.find(p => p.audio)?.audio;
    const audioBtn = document.getElementById('audio-btn');
    if (audioUrl) {
        audio = new Audio(audioUrl);
        audioBtn.classList.remove('hidden');
        audioBtn.onclick = () => audio.play();
    } else {
        audioBtn.classList.add('hidden');
    }

    // Display Definitions
    const defContainer = document.getElementById('definitions-list');
    defContainer.innerHTML = ""; // Clear old results
    
    data.meanings.slice(0, 3).forEach(meaning => {
        const div = document.createElement('div');
        div.className = 'definition-item';
        div.innerHTML = `
            <strong>${meaning.partOfSpeech}</strong>: 
            ${meaning.definitions[0].definition}
            <br><em>${meaning.definitions[0].example || ""}</em>
        `;
        defContainer.appendChild(div);
    });
// Handle Synonyms
    const synonyms = data.meanings[0].synonyms;
    const synList = document.getElementById('synonyms-list');
    synList.textContent = synonyms.length > 0 ? synonyms.join(', ') : "No synonyms found.";

    // Task Requirement: Dynamically update CSS (Highlight Effect)
    resultContainer.classList.add('highlight');
    setTimeout(() => resultContainer.classList.remove('highlight'), 1000);
}

function showError(message) {
    resultContainer.classList.add('hidden');
    errorMessage.classList.remove('hidden');
    errorMessage.textContent = `⚠️ ${message}. Please try another word.`;
}
