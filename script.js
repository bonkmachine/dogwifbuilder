document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('avatarCanvas');
    const ctx = canvas.getContext('2d');
    adjustCanvasForHighDPI(canvas);

    function getRandomOption(selectElement) {
        const options = selectElement.options;
        const randomIndex = Math.floor(Math.random() * options.length);
        return options[randomIndex].value;
    }
    
    function resetAvatar() {
        const defaults = {
            bg: 'bg.png',
            head: 'main.png',
            aura: 'none.png',
            cat: 'normal.png',
            face: 'none.png',
            hat: 'none.png',
            eyes: 'none.png',
            hands: 'none.png',
            outfit: 'none.png',
            friends: 'none.png'
        };

        Object.entries(defaults).forEach(([part, defaultValue]) => {
            const selectElement = document.getElementById(part);
            selectElement.value = defaultValue; // Reset the select element to the default value
            onPartChange(part, defaultValue); // Update the avatar part
        });
    }

    document.querySelector('.resetBtn').addEventListener('click', resetAvatar);

    document.querySelector('.randomizeBtn').addEventListener('click', function() {
        ['bg', 'head', 'aura', 'cat', 'hat', 'eyes', 'hands', 'outfit', 'friends'].forEach(part => {
            const selectElement = document.getElementById(part);
            const randomValue = getRandomOption(selectElement);
            selectElement.value = randomValue; // Update the select element with the random value
            onPartChange(part, randomValue); // Update the avatar part
        });
    });

    const selectedParts = {
        bg: 'images/bg/bg.png',
        aura: 'images/aura/none.png',
        head: 'images/head/main.png',
        cat:    'images/cat/none.png',
        eyes: 'images/eyes/none.png',
        hat: 'images/hat/none.png',
        outfit: 'images/outfit/none.png',
        hands:  'images/hands/none.png',
        friends: 'images/friends/none.png'
    };

    function adjustCanvasForHighDPI(canvas) {
        const dpi = window.devicePixelRatio || 1;
        const style = getComputedStyle(canvas);
        const width = parseInt(style.width) * dpi;
        const height = parseInt(style.height) * dpi;
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${width / dpi}px`;
        canvas.style.height = `${height / dpi}px`;
        ctx.scale(dpi, dpi);
    }

    function drawPart(partPath) {
        return new Promise(resolve => {
            const img = new Image();
            img.crossOrigin = 'anonymous'; // Enable CORS
            img.onload = function() {
                ctx.drawImage(img, 0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
                resolve();
            };
            img.src = partPath;
        });
    }

    async function updateAvatar() {
        ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
        for (const part of Object.keys(selectedParts)) {
            await drawPart(selectedParts[part]);
        }
    }

    function onPartChange(part, fileName) {
        selectedParts[part] = 'images/' + part + '/' + fileName;
        updateAvatar();
    }

    ['bg', 'cat', 'head', 'aura', 'hat', 'eyes', 'hands', 'outfit', 'friends' ].forEach(part => {
        document.getElementById(part)?.addEventListener('change', function() {
            onPartChange(part, this.value);
        });
    });

    document.querySelector('.downloadBtn').addEventListener('click', function() {
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.download = 'myQUOK.png';
            downloadLink.href = url;
            downloadLink.click();
            URL.revokeObjectURL(url);
        }, 'image/png');
    });

    updateAvatar(); // Initialize the avatar with default parts
});
