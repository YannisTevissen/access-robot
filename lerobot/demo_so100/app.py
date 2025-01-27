from flask import Flask, render_template, request, jsonify
import time
from lerobot.scripts.custom_manipulate import MyArm
import json
import os


app = Flask(__name__)
robot = MyArm()
robot.connect()

# Function to process the slider values
def process_slider_values(values):
    # Placeholder for your processing logic
    robot.move_arm(values)
    print(f"Received slider values: {values}")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/update_sliders', methods=['POST'])
def update_sliders():
    slider_values = request.json['slider_values']
    process_slider_values(slider_values)
    return jsonify({'status': 'success'})

@app.route('/save_position', methods=['POST'])
def save_position():
    data = request.json
    positions_file = 'saved_positions.json'
    
    try:
        if os.path.exists(positions_file):
            with open(positions_file, 'r') as f:
                saved_positions = json.load(f)
        else:
            saved_positions = {}
        
        saved_positions[data['name']] = data['positions']
        
        with open(positions_file, 'w') as f:
            json.dump(saved_positions, f, indent=4)
            
        return jsonify({'status': 'success', 'message': 'Position saved successfully'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/get_saved_positions', methods=['GET'])
def get_saved_positions():
    positions_file = 'saved_positions.json'
    
    try:
        if os.path.exists(positions_file):
            with open(positions_file, 'r') as f:
                saved_positions = json.load(f)
        else:
            saved_positions = {}
            
        return jsonify(saved_positions)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/delete_position', methods=['POST'])
def delete_position():
    data = request.json
    positions_file = 'saved_positions.json'
    
    try:
        if os.path.exists(positions_file):
            with open(positions_file, 'r') as f:
                saved_positions = json.load(f)
                
            if data['name'] in saved_positions:
                del saved_positions[data['name']]
                
                with open(positions_file, 'w') as f:
                    json.dump(saved_positions, f, indent=4)
                    
                return jsonify({'status': 'success', 'message': 'Position deleted successfully'})
            else:
                return jsonify({'status': 'error', 'message': 'Position not found'}), 404
        else:
            return jsonify({'status': 'error', 'message': 'No saved positions found'}), 404
            
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/disconnect', methods=['POST'])
def disconnect():
    robot.disconnect()
    return jsonify({'status': 'success', 'message': 'Disconnected from robot'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)