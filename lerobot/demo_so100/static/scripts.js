function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateSliderValue(sliderId) {
    const slider = document.getElementById(sliderId);
    const valueSpan = document.getElementById(sliderId + '_value');
    valueSpan.textContent = slider.value;
}
function getSliderValues() {
    return {
        shoulder_pan: parseFloat(document.getElementById('shoulder_pan').value),
        shoulder_lift: parseFloat(document.getElementById('shoulder_lift').value),
        elbow_flex: parseFloat(document.getElementById('elbow_flex').value),
        wrist_flex: parseFloat(document.getElementById('wrist_flex').value),
        wrist_roll: parseFloat(document.getElementById('wrist_roll').value),
        gripper: parseFloat(document.getElementById('gripper').value)
    };
}

function sendSliderValues() {
    let sliderValues = getSliderValues();
    updateSliderValue('shoulder_pan');
    updateSliderValue('shoulder_lift');
    updateSliderValue('elbow_flex');
    updateSliderValue('wrist_flex');
    updateSliderValue('wrist_roll');
    updateSliderValue('gripper');
    fetch('/update_sliders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ slider_values: sliderValues })
    })
    .then(response => response.json())
    .then(data => console.log(data.status))
    .catch(error => console.error('Error:', error));
}

function resetArmRest() {
    shoulder_pan_slider = document.getElementById('shoulder_pan');
    shoulder_lift_slider = document.getElementById('shoulder_lift');
    elbow_flex_slider = document.getElementById('elbow_flex');
    wrist_flex_slider = document.getElementById('wrist_flex');
    wrist_roll_slider = document.getElementById('wrist_roll');
    gripper_slider = document.getElementById('gripper');

    shoulder_pan_slider.value = -8.6;
    shoulder_lift_slider.value = -193.4;
    elbow_flex_slider.value = 182.2;
    wrist_flex_slider.value = 67.9;
    wrist_roll_slider.value = -2.8;
    gripper_slider.value = 0.07;


}


function resetArmTop() {
    shoulder_pan_slider = document.getElementById('shoulder_pan');
    shoulder_lift_slider = document.getElementById('shoulder_lift');
    elbow_flex_slider = document.getElementById('elbow_flex');
    wrist_flex_slider = document.getElementById('wrist_flex');
    wrist_roll_slider = document.getElementById('wrist_roll');
    gripper_slider = document.getElementById('gripper');

    shoulder_pan_slider.value = -8.6;
    shoulder_lift_slider.value = 120;
    elbow_flex_slider.value = 20;
    wrist_flex_slider.value = 100;
    wrist_roll_slider.value = -2.8;
    gripper_slider.value = 0.07;


}

async function sayHello() {
    resetArmTop();
    shoulder_pan_slider = document.getElementById('shoulder_pan');
    shoulder_lift_slider = document.getElementById('shoulder_lift');
    elbow_flex_slider = document.getElementById('elbow_flex');
    wrist_flex_slider = document.getElementById('wrist_flex');
    wrist_roll_slider = document.getElementById('wrist_roll');
    gripper_slider = document.getElementById('gripper');
    await sleep(2000);

    shoulder_pan_slider.value = 69.4;
    wrist_flex_slider = 36.6;
    await sleep(2000);
    gripper_slider.value = 49.7;
    await sleep(500);
    gripper_slider.value = -65;
    await sleep(500);
    gripper_slider.value = 49.7;
    await sleep(500);
    gripper_slider.value = -65;
    await sleep(500);
    gripper_slider.value = 49.7;
    await sleep(500);
    gripper_slider.value = -65;
}

// Send slider values every 1 second
setInterval(sendSliderValues, 1000);

function getCurrentPositions() {
    const sliderValues = getSliderValues();
    console.log(sliderValues);
    return sliderValues
}

async function saveCurrentPosition() {
    const name = prompt('Enter a name for this position:');
    if (!name) return;

    const positions = getCurrentPositions();
    console
    
    try {
        const response = await fetch('/save_position', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                positions: positions
            })
        });
        
        if (response.ok) {
            alert('Position saved successfully!');
            loadSavedPositionsList();
        } else {
            alert('Error saving position');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error saving position');
    }
}

async function loadSavedPositionsList() {
    try {
        const response = await fetch('/get_saved_positions');
        const positions = await response.json();
        
        const select = document.getElementById('savedPositions');
        // Clear all options except the first one
        select.innerHTML = '<option value="">Select Saved Position</option>';
        
        for (const [name, _] of Object.entries(positions)) {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function loadSavedPosition() {
    const select = document.getElementById('savedPositions');
    const selectedName = select.value;
    
    if (!selectedName) return;
    
    fetch('/get_saved_positions')
        .then(response => response.json())
        .then(positions => {
            const position = positions[selectedName];
            
            // Update slider values
            for (const [key, value] of Object.entries(position)) {
                const slider = document.getElementById(key);
                if (slider) {
                    slider.value = value;
                    updateSliderValue(key);
                }
            }
            
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error loading position');
        });
}

// Add this line at the end of your file to load saved positions when the page loads
document.addEventListener('DOMContentLoaded', loadSavedPositionsList);

async function deleteSelectedPosition() {
    const select = document.getElementById('savedPositions');
    const selectedName = select.value;
    
    if (!selectedName) {
        alert('Please select a position to delete');
        return;
    }
    
    if (!confirm(`Are you sure you want to delete the position "${selectedName}"?`)) {
        return;
    }
    
    try {
        const response = await fetch('/delete_position', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: selectedName
            })
        });
        
        if (response.ok) {
            alert('Position deleted successfully!');
            loadSavedPositionsList();
            select.value = ''; // Reset selection
        } else {
            alert('Error deleting position');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting position');
    }
}

async function disconnectRobot() {
    try {
        const response = await fetch('/disconnect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            })
        });

        if (response.ok) {
            alert('Robot successfully disconnected!');
        } else {
            alert('Error disconnecting robot');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error disconnecting robot');
    }
}

