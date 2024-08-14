let upperWear = [];
let bottomWear = [];
let combinations = [];

function addUpper() {
    const upperInput = document.getElementById('upperInput');
    const file = upperInput.files[0];
    const reader = new FileReader();

    reader.onloadend = function() {
        upperWear.push(reader.result);
        updateCombinations();
    }

    if (file) {
        reader.readAsDataURL(file);
    }

    upperInput.value = '';
}

function addBottom() {
    const bottomInput = document.getElementById('bottomInput');
    const file = bottomInput.files[0];
    const reader = new FileReader();

    reader.onloadend = function() {
        bottomWear.push(reader.result);
        updateCombinations();
    }

    if (file) {
        reader.readAsDataURL(file);
    }

    bottomInput.value = '';
}

function updateCombinations() {
    combinations = [];
    upperWear.forEach(upper => {
        bottomWear.forEach(bottom => {
            combinations.push({ upper, bottom });
        });
    });
    renderCombinations();
}

function renderCombinations() {
    const combinationsList = document.getElementById('combinationsList');
    combinationsList.innerHTML = '';
    combinations.forEach((combo, index) => {
        const listItem = document.createElement('li');
        
        const upperImg = document.createElement('img');
        upperImg.src = combo.upper;
        upperImg.alt = 'Upper Wear';
        upperImg.width = 50;
        upperImg.height = 50;

        const bottomImg = document.createElement('img');
        bottomImg.src = combo.bottom;
        bottomImg.alt = 'Bottom Wear';
        bottomImg.width = 50;
        bottomImg.height = 50;

        listItem.appendChild(upperImg);
        listItem.appendChild(document.createTextNode(' + '));
        listItem.appendChild(bottomImg);
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => {
            combinations.splice(index, 1);
            renderCombinations();
        };

        const shareButton = document.createElement('button');
        shareButton.textContent = 'Share';
        shareButton.onclick = () => shareCombination(combo);

        listItem.appendChild(deleteButton);
        listItem.appendChild(shareButton);
        combinationsList.appendChild(listItem);
    });
}

function shareCombination(combo) {
    const shareData = {
        title: 'Check out my outfit!',
        text: 'Here is a great clothing combination I created.',
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData).then(() => {
            console.log('Shared successfully');
        }).catch(error => {
            console.error('Error sharing:', error);
        });
    } else {
        alert('Share API is not supported in your browser.');
    }
}

function getDailyRecommendation() {
    if (combinations.length === 0) {
        document.getElementById('recommendationResult').textContent = 'No combinations available';
        return;
    }
    const randomIndex = Math.floor(Math.random() * combinations.length);
    const combo = combinations[randomIndex];
    showRecommendation(combo);
}

function getWeeklyRecommendation() {
    if (combinations.length < 7) {
        document.getElementById('recommendationResult').textContent = 'Not enough combinations available';
        return;
    }
    const weekCombo = [];
    while (weekCombo.length < 7) {
        const randomIndex = Math.floor(Math.random() * combinations.length);
        const combo = combinations[randomIndex];
        if (!weekCombo.includes(combo)) {
            weekCombo.push(combo);
        }
    }
    document.getElementById('recommendationResult').innerHTML = weekCombo.map((combo, index) => `
        <div>
            <h4>Day ${index + 1}</h4>
            <img src="${combo.upper}" alt="Upper Wear" width="50" height="50">
            <img src="${combo.bottom}" alt="Bottom Wear" width="50" height="50">
        </div>
    `).join('');
}

function showRecommendation(combo) {
    document.getElementById('recommendationResult').innerHTML = `
        <img src="${combo.upper}" alt="Upper Wear" width="50" height="50">
        <img src="${combo.bottom}" alt="Bottom Wear" width="50" height="50">
    `;
}

// Weather Integration
async function getWeather() {
    // Replace 'your_api_key' with your actual API key
    const apiKey = 'your_api_key';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=YourCity&appid=${apiKey}&units=metric`);
    const data = await response.json();
    return data;
}

async function getWeatherBasedRecommendation() {
    const weatherData = await getWeather();
    const temperature = weatherData.main.temp;
    let suitableCombinations = combinations.filter(combo => {
        // Example logic for temperature-based filtering
        if (temperature > 25) { // Warm weather
            return combo.season === 'summer' || combo.season === 'all';
        } else { // Cold weather
            return combo.season === 'winter' || combo.season === 'all';
        }
    });

    if (suitableCombinations.length === 0) {
        suitableCombinations = combinations; // Fallback to all combinations if no suitable ones found
    }

    const randomIndex = Math.floor(Math.random() * suitableCombinations.length);
    const combo = suitableCombinations[randomIndex];
    showRecommendation(combo);
}

// Virtual Wardrobe
function showVirtualWardrobe() {
    const wardrobeContainer = document.getElementById('virtualWardrobe');
    wardrobeContainer.innerHTML = '<h3>Virtual Wardrobe</h3>';

    upperWear.forEach((upper, index) => {
        const upperImg = document.createElement('img');
        upperImg.src = upper;
        upperImg.alt = 'Upper Wear';
        upperImg.width = 50;
        upperImg.height = 50;
        wardrobeContainer.appendChild(upperImg);
    });

    bottomWear.forEach((bottom, index) => {
        const bottomImg = document.createElement('img');
        bottomImg.src = bottom;
        bottomImg.alt = 'Bottom Wear';
        bottomImg.width = 50;
        bottomImg.height = 50;
        wardrobeContainer.appendChild(bottomImg);
    });
}

// Reminder Notifications
function setReminder() {
    if (Notification.permission === 'granted') {
        new Notification('Don\'t forget to update your wardrobe today!');
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('Don\'t forget to update your wardrobe today!');
            }
        });
    }
}

// Set reminder every 24 hours
setInterval(setReminder, 24 * 60 * 60 * 1000);

