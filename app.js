const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

let output = [];

let questions = [
  {
    type: 'confirm',
    name: 'manager',
    message: 'Would you like to add a Manager?',
    default: true,
    when: () => !output.some(output => output instanceof Manager),
  },
  {
    type: 'list',
    name: 'role',
    message: 'What is the role of this team member?',
    choices: ['Manager'],
    when: function (answers) {
      return answers.manager == true;
    }
  },
  {
    type: 'list',
    name: 'role',
    message: 'What role would you like to add?',
    choices: ['Engineer', 'Intern'],
    when: function (answers) {
      return answers.manager == false || !answers.manager;
    }
  },
  {
    type: 'input',
    name: 'officeNumber',
    message: 'What is the team memebers office number?',
    when: function (answers) {
      return answers.role == 'Manager';
    }
  },
  {
    type: 'input',
    name: 'github',
    message: 'What is the team memebers GitHub profile?',
    when: function (answers) {
      return answers.role == 'Engineer';
    }
  },
  {
    type: 'input',
    name: 'school',
    message: 'What school did the team member go to?',
    when: function (answers) {
      return answers.role == 'Intern';
    }
  },
  {
    type: 'input',
    name: 'name',
    message: 'What is the team memebers name?',
  },
  {
    type: 'input',
    name: 'id',
    message: 'What is the team memebers ID?',
  },
  {
    type: 'input',
    name: 'email',
    message: 'What is the team memebers email?',
  },
  {
    type: 'confirm',
    name: 'addAnother',
    message: 'Would you like to add another employee?',
    default: true,
  },
];

function ask() {
  return inquirer.prompt(questions).then((answers) => {

    switch (answers.role) {
      case "Manager":
        output.push(new Manager(answers.name, answers.id, answers.email, answers.officeNumber));
        console.log(output);
        break;

      case "Engineer":
        output.push(new Engineer(answers.name, answers.id, answers.email, answers.github));
        console.log(output);
        break;

      case "Intern":
        output.push(new Intern(answers.name, answers.id, answers.email, answers.school));
        console.log(output);
        break;

      default:
        console.log("The role was not recognized");
    }

    if (answers.addAnother === true) {

      return ask();

    } else {

      const rendered = render(output);

      fs.writeFile(outputPath, rendered, (err) => {
        if (err) return console.log(err);
        console.log("File successfully created!");
      })
    }
  }).catch()   
};

ask()


// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ``
