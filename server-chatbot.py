from flask import Flask, request, jsonify
from llama_cpp import Llama

# Initialize Flask application
app = Flask(__name__)

# Initialize Llama model
llm = Llama(model_path="mistral-7b.gguf")

# Define route to handle incoming requests
@app.route('/generate', methods=['POST'])
def generate_response():
    # Get data from request
    data = request.json
    prompt = data.get('prompt')
    max_tokens = data.get('max_tokens')
    
    # Generate output using Llama model
    output = llm(prompt, max_tokens=max_tokens, stop=["User:"])
    
    # Return output as JSON
    return jsonify({'output': output})

if __name__ == '__main__':
    # Run Flask application
    app.run()
