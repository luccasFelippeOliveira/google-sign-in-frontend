var id_token = null;

function onSignIn(googleUser) {
  // Useful data for your client-side scripts:
  var profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId());
  console.log('Full Name: ' + profile.getName());

  // The ID token you need to pass to your backend:
  id_token = googleUser.getAuthResponse().id_token;
  console.log("GTOKEN = " + id_token);
  buildApp();
};

// Calls a hello world API if authenticated.
function buildApp() {
  toggleSignInButton(true);
  // show message from backend
  // TODO: backend.
  createMessage("THIS IS A TEST");
  buildLogOff();
};

function callAPI() {
  // Check id_token
  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:3000/hello');
  xhr.setRequestHeader("Content-Type", "text/plain");
  xhr.setRequestHeader("X-Auth-Code", id_token);
  xhr.onload = function() {
    if (xhr.status === 200) {
      let obj = JSON.parse(xhr.response);
      console.log(obj)
    } else {
      alert("failed");
    }
  }
  xhr.send();
}

// Hides or show the signin button,
// if state is true hide, otherwise show.
function toggleSignInButton(state) {
  const button = document.getElementById("google-signin-button");
  if (state) {
    // add hidden class.
    button.classList.add("hidden");
  } else {
    // remove hidden class.
    button.classList.remove("hidden");
  }
}


function createMessage(msg) {
  const app = document.getElementById("app");
  const div = document.createElement("div");
  const innerParagraph = document.createElement("p");
  innerParagraph.innerHTML = msg;
  div.appendChild(innerParagraph);
  app.appendChild(div);
}

function buildLogOff() {
  const app = document.getElementById("app");
  const div = document.createElement("div");
  div.innerHTML = '<a href="#" onclick="logOff();">Log out </a>';
  app.appendChild(div);
}

function logOff() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log("User signed out");

    const app = document.getElementById("app");
    while (app.hasChildNodes()) {
      app.removeChild(app.firstChild);
    }
    // Show loginButton
    toggleSignInButton(false);
    id_token = null;
  })
}