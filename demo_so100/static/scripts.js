function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateSliderValue(sliderId) {
    const slider = document.getElementById(sliderId);
    const valueSpan = document.getElementById(sliderId + '_value');
    valueSpan.textContent = slider.value;
}
function getSliderValues() {

    const sl = parseFloat(document.getElementById('shoulder_lift').value);
    const ef = parseFloat(document.getElementById('elbow_flex').value);
    const wf = parseFloat(document.getElementById('wrist_flex').value);
    document.getElementById('total').value = sl + ef + wf;
    updateSliderValue('total');

    return {
        shoulder_pan: parseFloat(document.getElementById('shoulder_pan').value),
        shoulder_lift: parseFloat(document.getElementById('shoulder_lift').value),
        elbow_flex: parseFloat(document.getElementById('elbow_flex').value),
        wrist_flex: parseFloat(document.getElementById('wrist_flex').value),
        wrist_roll: parseFloat(document.getElementById('wrist_roll').value),
    };
}

function sendSliderValues() {
    let sliderValues = getSliderValues();
    updateSliderValue('shoulder_pan');
    updateSliderValue('shoulder_lift');
    updateSliderValue('elbow_flex');
    updateSliderValue('wrist_flex');
    updateSliderValue('wrist_roll');
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

    shoulder_pan_slider.value = -4.2;
    shoulder_lift_slider.value = -175;
    elbow_flex_slider.value = 188.4;
    wrist_flex_slider.value = -9;
    wrist_roll_slider.value = 90;
}


function resetArmTop() {
    shoulder_pan_slider = document.getElementById('shoulder_pan');
    shoulder_lift_slider = document.getElementById('shoulder_lift');
    elbow_flex_slider = document.getElementById('elbow_flex');
    wrist_flex_slider = document.getElementById('wrist_flex');
    wrist_roll_slider = document.getElementById('wrist_roll');
    gripper_slider = document.getElementById('gripper');

    shoulder_pan_slider.value = -71.3;
    shoulder_lift_slider.value = -200;
    elbow_flex_slider.value = 121.8;
    wrist_flex_slider.value = 28;
    wrist_roll_slider.value = 90;


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

