
function chatOpen() {
  document.getElementById("chat-open").style.display = "none";
  document.getElementById("chat-close").style.display = "block";
  openConversation();
  document.getElementById('userChatInput').focus();
}
function chatClose() {
  document.getElementById("chat-open").style.display = "block";
  document.getElementById("chat-close").style.display = "none";
  document.getElementById("chat-window").style.display = "none";

}
function openConversation() {
  document.getElementById("chat-window").style.display = "flex";
}

function userResponse() {
  console.log("response");
  let userText = document.getElementById("userChatInput").value;

  if (userText == "") {
    writeResponse('Please ask a question!');
  } else {
    document.getElementById("messageBox").innerHTML += `<div class="first-chat">
      <div class="first-chat__bubble">
        <p>${userText}</p>
        <div class="arrow"></div>
      </div
    </div>`;

    document.getElementById("userChatInput").value = "";
    var objDiv = document.getElementById("messageBox");
    objDiv.scrollTop = objDiv.scrollHeight;

    showTypingGif();
    adminResponse(userText);
  }
}

function adminResponse(questionText) {
  let options = {
    method: "POST",
    headers: {
      "Content-Type":"application/json",
    },
    body: JSON.stringify({accountToken: accountToken, question: questionText, conversationHistory: conversationHistory})
  }

  fetch("/answer",options)
    .then((response) => {
      return response.json();
    })
    .then((responseData) => {
      writeResponse(responseData.text);
      conversationHistory += questionText + "\n\n" + responseData.text;
    })
    .catch((error) => {
      writeResponse('Sorry, something went wrong and I couldn\'t answer your question. Try again later...');
    });
}

function writeResponse(responseText) {

  hideTypingGif();
  document.getElementById(
      "messageBox"
  ).innerHTML += `<div class="second-chat">
          <div class="circle" id="circle-mar"></div>
          <div class="second-chat__bubble">
            <p>${responseText}</p>
            <div class="arrow"></div>
          </div
        </div>`;

  var objDiv = document.getElementById("messageBox");
  objDiv.scrollTop = objDiv.scrollHeight;

}

function showTypingGif() {

  document.getElementById(
      "messageBox"
  ).innerHTML += `<div class="second-chat" id="typing-dots">
          <div class="circle" id="circle-mar"></div>
          <div class="second-chat__bubble">
            <p><img src="images/typing-dots.gif" alt="Typing..." /></p>
            <div class="arrow"></div>
          </div
        </div>`;

  var objDiv = document.getElementById("messageBox");
  objDiv.scrollTop = objDiv.scrollHeight;
}

function hideTypingGif() {
  document.getElementById("typing-dots").outerHTML="";
}

//press enter on keyboard and send message
addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    
    const e = document.getElementById("userChatInput");
    if (e === document.activeElement) {
      userResponse();
    }
  }
});

function generateUUID() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}
