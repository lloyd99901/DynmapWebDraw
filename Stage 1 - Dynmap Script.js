// MIT License
// Copyright (c) 2025 Lunar
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

console.info(`
    MIT License
    Copyright (c) 2025 Lunar
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    `); //Print license info.

console.info("DynmapWebDraw v0.1 | Initializing Dynmap Drawing Script...");
const coordsList = []; // Array to store coordinates
let consoleLogLimit = 50; // Maximum number of log entries before clearing
let soundFeedbackEnabled = true; // Enable/disable sound feedback

function getCurrentCoordinate() {
    const coordElement = document.querySelector('.coord-control-value');
    if (!coordElement) {
        console.error('DynmapWebDraw | Error: Coordinate element not found!');
        return '';
    }
    //console.debug('DynmapWebDraw | Current coordinate:', coordElement.textContent);
    return coordElement.textContent;
}

function addCoordinate(coord) {
    coordsList.push(coord);
    console.log('DynmapWebDraw | Added coordinate:', coord);
    // Play sound feedback if enabled
    if (soundFeedbackEnabled) {
        playAddSound();
    }
    // Check if console log limit reached and clear if necessary
    if (coordsList.length >= consoleLogLimit) {
        clearConsole();
    }
}

function clearConsole() {
    console.clear();
    console.log('DynmapWebDraw | Console cleared due to log limit.');
}

function playAddSound() {
    // Create an audio context and oscillator for a simple beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // 440 Hz is a A4 note
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Adjust volume
    oscillator.start();
    setTimeout(() => oscillator.stop(), 100);
}

function undoLastCoordinate() {
    if (coordsList.length === 0) {
        console.error('DynmapWebDraw | Error: No coordinates to undo!');
        return;
    }
    const removedCoord = coordsList.pop();
    console.log('DynmapWebDraw | Undid coordinate:', removedCoord);
    // Check if console log limit reached and clear if necessary
    if (coordsList.length >= consoleLogLimit) {
        clearConsole();
    }
}

async function saveCoordinatesToFile() {
    try {
        // Create a Blob with the coordinates
        const blob = new Blob([coordsList.join('\n')], { type: 'text/plain' });
        // Create an object URL for the blob
        const url = window.URL.createObjectURL(blob);
        // Create an anchor element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dynmap_coords.txt';
        // Append and click the anchor element
        document.body.appendChild(a);
        a.click();
        // Remove the anchor element after it has been clicked
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 500);
        console.info('DynmapWebDraw | Coordinates saved to dynmap_coords.txt');
        coordsList.length = 0;
  
        console.log('Now load the coordinate file into the AHK script provided in the github repo. Make sure you have selected the Minecraft server terminal beforehand.');
    } catch (error) {
        console.error('DynmapWebDraw | Error saving coordinates:', error);
    }
}

document.addEventListener('keydown', function(event) {
    const key = event.key.toLowerCase();
    if (key === 'x') { // Add coordinate
        const coord = getCurrentCoordinate();
        if (coord) {
            addCoordinate(coord);
        }
        else {
            console.error('DynmapWebDraw | Error in processing coordinate! Function getCurrentCoordinate returned an invalid value: ', coord);
        }
    } else if (key === 'u') { // Undo last coordinate
        undoLastCoordinate();
    } else if (key === 'w') { // Save coordinates to file
        saveCoordinatesToFile();
    }
});

function showHelp() {
    const helpText =
        "Keyboard Shortcuts:\n" +
        "- X: Add current coordinate\n" +
        "- U: Undo last coordinate\n" +
        "- W: Save all coordinates to dynmap_coords.txt\n" +
        "Once the coordinates have been saved, you need to load them into the AHK script, the script will then automatically write the coordinates to the server console of the Minecraft server." +
        "\nPress F1 for additional options.";
    console.info('DynmapWebDraw | Help information displayed.');
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'F1') {
        event.preventDefault();
        showHelp();
    }
});

console.info("DynmapWebDraw | ✅ Loaded script. Keys available to press:");
console.info("- X = Add coordinate (This will play a sound to let you know when a coordinate has been written)");
console.info("- U = Undo last coordinate");
console.info("- W = Save all coordinates to a file");
console.info("- F1 = Show help information");