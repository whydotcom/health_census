const addPatientButton = document.getElementById("addPatient");
const report = document.getElementById("report");
const btnSearch = document.getElementById('btnSearch');

// Stores the collected patient data
// in an empty array
const patients = [];

function addPatient() {
    const name = document.getElementById("name").value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const age = document.getElementById("age").value;
    const condition = document.getElementById("condition").value;
    
    // pushes the values of name, and gender, and age, and condition into
    // the empty array patient we set up above
    if (name && gender && age && condition) {
      patients.push({ name, gender: gender.value, age, condition });
      
      // method to reset the fields for the 
      // next entry
      resetForm();

      // updates and displays the analysis report based on the newly
      // added patient data
      generateReport();
    }
  }

  function resetForm() {

    // sets all the elements in the patient form to "" which is an emoty string
    document.getElementById("name").value = "";
    document.querySelector('input[name="gender"]:checked').checked = false;
    document.getElementById("age").value = "";
    document.getElementById("condition").value = "";
  }



  function generateReport() {
    
    // finds number of patients through length of 
    // patient array
    const numPatients = patients.length;
    
    // object that can contain information
    // on condition count
    const conditionsCount = {
      Diabetes: 0,
      Thyroid: 0,
      "High Blood Pressure": 0,
    };

    // nested object that keeps condition counts
    // in relation to gender
    const genderConditionsCount = {
      Male: {
        Diabetes: 0,
        Thyroid: 0,
        "High Blood Pressure": 0,
      }, 
      Female: {
        Diabetes: 0,
        Thyroid: 0,
        "High Blood Pressure": 0,
      },
      Other: {
        Diabetes: 0,
        Thyroid: 0,
        "High Blood Pressure": 0,
      },
    };

    // for... of loop that iterated through 
    // condition (in the case of conditionCount)
    // and condition AND gender (in the case of 
    // genderConditionCount) and adds the information accordingly
    for (const patient of patients) {
      conditionsCount[patient.condition]++;
      genderConditionsCount[patient.gender][patient.condition]++;
    }

    // changes the html content of elements in const report
    report.innerHTML = `Number of patients: ${numPatients}<br><br>`;
    report.innerHTML += `Conditions Breakdown:<br>`;
   
   
    for (const condition in conditionsCount) {
      report.innerHTML += `${condition}: ${conditionsCount[condition]}<br>`;
    }

    report.innerHTML += `<br>Gender-Based Conditions:<br>`;
    for (const gender in genderConditionsCount) {
      report.innerHTML += `<br>${gender}:<br>`;
      for (const condition in genderConditionsCount[gender]) {
        report.innerHTML += `&nbsp;&nbsp;${condition}: ${genderConditionsCount[gender][condition]}<br>`;
      }
    }
  }


  // event listener to listen for when patient button is pressed
  // and runs addPatient
addPatientButton.addEventListener("click", addPatient);

// fetches health conidtion data from health.json file and searches for matching condition based 
function searchCondition() {
    const input = document.getElementById('conditionInput').value.toLowerCase();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';


    // This API method initiates a fetch request to the file named 'health.json'. 
    // It assumes a JSON file named 'health.json' is in the same directory as the HTML file.
    fetch('health_analysis.json')

        // .then(response => response.json())
      .then(response => response.json())
      
      // This handles the retrieved JSON data. It searches for a health condition that matches the user input.
      .then(data => {

        // This searches within the JSON data for a health condition whose name matches the entered input.
        const condition = data.conditions.find(item => item.name.toLowerCase() === input);


        // This code checks for a matching condition. 
        // If found, it constructs HTML content to display details about the condition 
        // (name, symptoms, prevention, treatment) within the resultDiv. 
        // If the system cannot find a matching condition, it displays a 'Condition not found' message within the resultDiv.
        if (condition) {

            // joins symptoms and prevention and symptoms by a ","
            // and if you look closesly, there is a space after the comma
            // this lists whatever strings are held in these corresponding
            // objects (or variables) with a comma and a space
          const symptoms = condition.symptoms.join(', ');
          const prevention = condition.prevention.join(', ');
          const treatment = condition.treatment;

          resultDiv.innerHTML += `<h2>${condition.name}</h2>`;
          resultDiv.innerHTML += `<img src="${condition.imagesrc}" alt="hjh">`;

          resultDiv.innerHTML += `<p><strong>Symptoms:</strong> ${symptoms}</p>`;
          resultDiv.innerHTML += `<p><strong>Prevention:</strong> ${prevention}</p>`;
          resultDiv.innerHTML += `<p><strong>Treatment:</strong> ${treatment}</p>`;
        } else {
          resultDiv.innerHTML = 'Condition not found.';
        }
      })

      // This handles any errors that might occur during the fetch request or data processing. 
      // If an error occurs, it logs it to the console and displays an error message within the resultDiv.
      .catch(error => {
        console.error('Error:', error);
        resultDiv.innerHTML = 'An error occurred while fetching data.';
      });
  }
    // event listener for a the search button for searching conditions
    btnSearch.addEventListener('click', searchCondition);


    