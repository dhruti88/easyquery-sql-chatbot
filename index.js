const express = require('express');
const path = require('path');
const axios = require('axios');
var request = require('request');
var bodyParser = require('body-parser')


// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
 

const app = express();
const PORT = 3000;
let ddl = `
CREATE TABLE Employees (
EmployeeID INT PRIMARY KEY,
FirstName VARCHAR(50),
LastName VARCHAR(50),
DepartmentID INT,
Salary DECIMAL(10,2)
);
CREATE TABLE Departments (
DepartmentID INT PRIMARY KEY,
DepartmentName VARCHAR(50)
);
`;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// POST endpoint to receive prompt and call /generate API
app.post('/generate', jsonParser, async (req, res) => {
  try {
    // Extract prompt from request body
    const { prompt } = req.body;

    // Check if prompt is provided
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Make POST request to external API
    const response = await axios.post('http://localhost:5000/generate', {
      prompt: prompt,
      max_length: 1024
    });

    // Forward the response from the external API
    res.json(response.data);
  } catch (error) {
    // Handle errors
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/set-ddl', urlencodedParser, function(req, res) {
    if (req.body.password == "teamtechno") {
        ddl = req.body.ddl
        res.send("Changed to "+ ddl)
    }else {
        res.send("Not allowed :)")
    }
})

app.get('/get-ddl', urlencodedParser, function(req, res) {
    res.send(ddl)
})

