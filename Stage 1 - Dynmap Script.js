// NOTE:
// [!] To use this, please copy this code and paste this to the developer console when you are on the Dynmap web interface. [!]
// -------------
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
console.clear();
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
console.info("DynmapWebDraw v0.4 | 🔃 Initializing DynmapWebDraw...");
//REQUIRED VARIABLES
const coordsList = []; // Array to store coordinates
let soundFeedbackEnabled = true; // Enable/disable sound feedback
let holdInterval = null;
var clickDelay = 200; // ms between coordinate placements
var lastMousePos = null; // Used for map drawing functions
var crossSize = 0.0007; // Size of the crosshair in lat/lng degrees
var drawnCrosses = []; // Track all lines drawn, used for undo action.
var clickPoints = [];
var pathLine = L.polyline(clickPoints, {
    color: 'red',
    weight: 2
}).addTo(map);

//COORDINATE FUNCTIONS

function getCurrentCoordinate() {
    const coordElement = document.querySelector('.coord-control-value');
    if (!coordElement) {
        console.error('DynmapWebDraw | ❌ Error: Coordinate element not found!');
        return '';
    }
    //console.debug('DynmapWebDraw | Current coordinate:', coordElement.textContent);
    return coordElement.textContent;
}

function addCoordinateToCoordList(coord) {
    coordsList.push(coord);
    console.log('DynmapWebDraw | 📝 Added ', coordsList.length, '# coordinate:', coord);
    // Play sound feedback if enabled
    if (soundFeedbackEnabled) {
        playAddSound();
    }
}

function undoLastCoordinate() {
    if (coordsList.length === 0) {
        console.error('DynmapWebDraw | ❌ Error: No coordinates to undo!');
        return;
    }
    const removedCoord = coordsList.pop();
    undoLastDrawnLine();
    console.log('DynmapWebDraw | ◀️ Undid coordinate:', removedCoord, ' Total coordinates remaining: ', coordsList.length);
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
        a.download = `dynmap_coords_${new Date().toISOString().split('T')[0]}.txt`;
        // Append and click the anchor element
        document.body.appendChild(a);
        a.click();
        // Remove the anchor element after it has been clicked
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 500);
        console.info('DynmapWebDraw | 💾 Coordinates saved to dynmap_coords.txt');
        coordsList.length = 0;
        clearAllLines();
        console.log('DynmapWebDraw | ℹ️ Now load the coordinate file into the AHK script provided in the github repo. Make sure you have selected the Minecraft server terminal beforehand.');
    } catch (error) {
        console.error('DynmapWebDraw | ❌ Error saving coordinates:', error);
    }
}

function copyCoordinatesToClipboard(data) {
    try {
        const processedData = data.replace(/,/g, ' '); // Replace commas with spaces since coord function returns commas
        return navigator.clipboard.writeText(processedData)
            .then(() => console.log('DynmapWebDraw | 📋 Coordinates copied to clipboard.'))
            .catch(err => console.error('DynmapWebDraw | ❌ Failed to copy coordinates:', err));
    } catch (err) {
        console.error('DynmapWebDraw | ❌ Error in copyToClipboard:', err);
        return null;
    }
}

// NOTIFICATION FUNCTIONS

function playAddSound() {
    // Create an audio context and oscillator for a simple beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // 440 Hz is a A4 note
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime); // Adjust volume
    oscillator.start();
    setTimeout(() => oscillator.stop(), 70);
}

// EVENT HANDLERS

// If left mouse is on, disable dragging, if it's up, enable it to allow the middle mouse to drag the map.
map.getContainer().addEventListener('mousedown', function(e) {
    if (e.button === 0) { // Left mouse
        map.dragging.disable();
    }
});
map.getContainer().addEventListener('mouseup', function(e) {
    if (e.button === 0) { // Middle mouse
        map.dragging.enable();
    }
});

map.on('mousedown', function(e) { //Rapid draw function
    if (e.originalEvent.button !== 0) return; // Only respond to left-click
    const coord = getCurrentCoordinate();
    if (!coord) {
        console.error('DynmapWebDraw | ❌ Invalid coordinate retrieved.');
        return;
    }
    addCoordinateToCoordList(coord); //Once user clicks, add coordinate, but then invoke the holdInterval on the clickDelay.
    drawAtCursor();
    // Start repeating action every X ms while held
    holdInterval = setInterval(() => {
        const coord = getCurrentCoordinate();
        if (!coord) {
            console.error('DynmapWebDraw | ❌ Invalid coordinate retrieved.');
            return;
        }
        addCoordinateToCoordList(coord); //Once user clicks, add coordinate, but then invoke the holdInterval on the clickDelay.
        drawAtCursor();
    }, clickDelay);
});

// Stop the interval when the mouse button is released
map.on('mouseup', function(e) {
    if (holdInterval !== null) {
        clearInterval(holdInterval);
        holdInterval = null;
    }
});

function handleKeyBindPress(key) {
    switch (key) {
        case 'x':
            const coord = getCurrentCoordinate();
            if (!coord) {
                console.error('DynmapWebDraw | ❌ Invalid coordinate retrieved.');
                return;
            }
            addCoordinateToCoordList(coord);
            drawAtCursor();
            break;
        case 'u':
            undoLastCoordinate();
            break;
        case 'w':
            saveCoordinatesToFile();
            break;
        case 'f1':
            showHelp();
            break;
        case 'm':
            copyCoordinatesToClipboard(coord);
            break;
    }
}

document.addEventListener('keydown', function(event) {
    const key = event.key.toLowerCase();
    handleKeyBindPress(key);
});

//CURSOR CHANGER

$(document).ready(function() {
    // Override cursor styles to precision cursor on page load
    $('.leaflet-interactive, .leaflet-grab, .leaflet-crosshair').css('cursor', 'crosshair');

    setInterval(() => {
        $('.leaflet-interactive, .leaflet-grab, .leaflet-crosshair').css('cursor', 'crosshair');
    }, 50);
});

//GRAPHICS FUNCTIONS

// Helper to draw a red crosshair at a given point
function drawCross(pt) {
    var lat = pt.lat, lng = pt.lng, d = crossSize;

    // create two red lines as a group
    var group = L.layerGroup([L.polyline([[lat, lng - d], [lat, lng + d]], { color:'red', weight:2 }),L.polyline([[lat - d, lng], [lat + d, lng]], { color:'red', weight:2 })]).addTo(map);

    drawnCrosses.push(group);
}

map.on('mousemove', function(e){
    lastMousePos = e.latlng;
});

function drawLineToMap(latlng){
    clickPoints.push(latlng);
    drawCross(latlng);
    pathLine.setLatLngs(clickPoints);
}

function drawAtCursor(){
    if(!lastMousePos) return;
    drawLineToMap(lastMousePos);
}

function undoLastDrawnLine() {
    // Nothing to undo?
    if (clickPoints.length === 0) return;

    // 1) Remove the last stored point
    clickPoints.pop();

    // 2) Update the main polyline
    pathLine.setLatLngs(clickPoints);

    // 3) Remove the last crosshair group
    var lastGroup = drawnCrosses.pop();
    if (lastGroup) {
    map.removeLayer(lastGroup);
    }
}

function clearAllLines() {
    // Destroy all points!
    clickPoints = [];
    pathLine.setLatLngs([]);

    // Destroy all crosshair groups!
    drawnCrosses.forEach(g => map.removeLayer(g));
    drawnCrosses = [];
}

//STARTUP

function showKeybindHelp() {
    console.info("- Left Mouse Click 🖱️ or X = 📝 Add coordinate (This will play a sound to let you know when a coordinate has been written)");
    console.info("- Middle Mouse Click = Move map.");
    console.info("- U = ◀️ Undo last coordinate");
    console.info("- W = 💾 Save all coordinates to a file");
    console.info("- M = 📋 Save coordinates to clipboard (Useful for marker points)");
    console.info("- F1 = ❔ Show help information");
    console.info("- ℹ️ Note: The visual lines you see when drawing the map may not be 100% accurate. Use it as a reference.");
    console.info("- ℹ️ To unload DynmapWebDraw, reload the Dynmap page.");
    console.info("- Variables to change:");
    console.info("- soundFeedbackEnabled (Plays beep sound when adding coordinate) : (default = true)");
    console.info("- clickDelay (Delay before another coordinate is added when holding the mouse down) : (default = 200)");
    console.info("- crossSize (Size of the crosshair in lat/lng degrees) : (default = 0.0007)");
}

console.info("DynmapWebDraw | ✅ Loaded script. Keys available to press:");
showKeybindHelp();