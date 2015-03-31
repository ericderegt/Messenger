// TCP Messenger
// Structure of this file is as follows:
//   1. Variable declaration
//   2. Functions
//   3. Control flow for user input to server
// At the bottom of the file I've included a description of how I structured the data in case anything is unclear from reading the code or comments.

// Variable declaration
var net = require('net');
var fs = require('fs');
var server = net.createServer();
var dataFile = JSON.parse(fs.readFileSync('./messages.json', 'utf8'));

// messageLog writes data to json file
function messageLog(data) {
	fs.writeFileSync('./messages.json', JSON.stringify(data), 'utf8');
}

// checkUser gets called when someone tries to create a username
function checkUser(user1) {
  for(var i = 0; i < dataFile.length; i++) {
    if (dataFile[i].username === user1) {
      return true;  
    } 
  }
  return false;  
}

// sendMessage adds msgString to sent object for sender and received object for receiver
function sendMessage(sender,receiver,msgString) {
  for (var i = 0; i < dataFile.length; i++) {
    if (dataFile[i].username === sender) {
      if (dataFile[i].sent.hasOwnProperty(receiver) === true) {
        dataFile[i].sent[receiver].push(msgString);
        messageLog(dataFile); 
      } else {
          dataFile[i].sent[receiver] = [];
          dataFile[i].sent[receiver].push(msgString);
          messageLog(dataFile);
      }
    }
  }

  for (var i = 0; i < dataFile.length; i++) {
    if (dataFile[i].username === receiver) {
      if (dataFile[i].received.hasOwnProperty(sender) === true) {
        dataFile[i].received[sender].push(msgString);
        messageLog(dataFile); 
      } else {
          dataFile[i].received[sender] = [];
          dataFile[i].received[sender].push(msgString);
          messageLog(dataFile);
      }
    }
  }
}

// clearMessage function can be used for clearing sent messages or received messages.
// user1 is the user who is performing the action and user2 is the other user. type is sent/received.
// For example, if the command is "eric clear sent sean", then user1 = eric, user2 = sean, type = sent
function clearMessage(user1, user2, type) {
  for (var i = 0; i < dataFile.length; i++) {
    if (dataFile[i].username === user1) {
      dataFile[i][type][user2].forEach(function(element,index) {
        dataFile[i][type][user2].splice(0,1);
      });
      dataFile[i][type][user2].splice(0,1);
    }        
  }
  messageLog(dataFile);
}

// Start of server connection
server.on('connection', function(client) { //'connection' listener
  console.log('client connected');
  client.setEncoding('utf8');
  client.write('Welcome to TCP Messenger. Enter a command to continue: ');

  client.on('data', function(input) {
    var userInput = input.trim().split(' ');

// ***CONTROL FLOW FROM USER INPUT STARTS HERE***
    if (userInput[0] === 'create') { // checks if username exists with checkUser function other creates username
    	if (checkUser(userInput[1]) === true) {
        client.write('\nUsername already exists. Please choose another name. Type list to see current users. Or type create "username" to select another username\n');    
      } else {
          var newUser = {}; // Lines 64-69 create a new object with user's name, sent messages, and received messages
          newUser.username = userInput[1];
          newUser.sent = {};
          newUser.received = {};
          dataFile.push(newUser);
          messageLog(dataFile);
          client.write("\nThe username " + userInput[1] + " has been created! \nEnter another command to continue: ");
      }
    } else if (userInput[0] === 'list') { // lists all usernames
        client.write('\nUser List\n');
        
        for (var i = 0; i < dataFile.length; i++) {
          client.write('- ' + dataFile[i].username + "\n");
        }
        client.write('\nEnter another command: ');
    } else if (userInput[1] === 'send') { // send control flow
        var sender = userInput[0];
        var receiver = userInput[2];
        var msgInput = userInput;
        msgInput.splice(0,3);
        var msgString = msgInput.join(' ');

        if (checkUser(sender) === true && checkUser(receiver) === true) {
          sendMessage(sender,receiver,msgString); //calls sendMessage function with user's input
          client.write("\nSent '" + msgString + "' to " + receiver + "\n");
          client.write('\nEnter another command: ');
        } else {
            client.write('\nPlease enter valid usernames!\nEnter another command: ');
        }

    } else if (userInput[1] === 'messages' && userInput.length > 2) { // messages control flow
        var userInbox = userInput[0];
        var fromUser = userInput[2];

        if (checkUser(userInbox) === true && checkUser(fromUser) === true) {
          client.write("\n" + userInbox + "'s messages from " + fromUser + "\n"); 

          for (var i = 0; i < dataFile.length; i++) {
            if (dataFile[i].username === userInbox) {
              dataFile[i].received[fromUser].forEach(function(element) {
                client.write('- ' + element + '\n');
              });
            }        
          }
          client.write('\n Enter another command: ');
        } else {
            client.write('\nPlease enter valid usernames!\nEnter another command: ');
        }
    } else if (userInput[1] === 'sent' && userInput.length > 2) { // sent control flow
        var userOutbox = userInput[0];
        var toUser = userInput[2];

        if(checkUser(userOutbox) === true && checkUser(toUser) === true) {
          client.write("\n" + userOutbox + "'s messages to " + toUser + "\n"); 

          for (var i = 0; i < dataFile.length; i++) {
            if (dataFile[i].username === userOutbox) {
              dataFile[i].sent[toUser].forEach(function(element) {
                client.write('- ' + element + '\n');
              });
            }        
          }
          client.write('\n Enter another command: ');
        } else {
            client.write('\nPlease enter valid usernames!\nEnter another command: ');
        }
    } else if (userInput[1] === 'clear' && userInput[2] === 'sent' && userInput.length === 4) { // clear sent messages
        var userOutbox = userInput[0];
        var toUser = userInput[3];

        if (checkUser(userOutbox) === true && checkUser(toUser) === true) {
          clearMessage(userOutbox,toUser,"sent");
          client.write('\n Messages cleared. Enter another command: ');
        }
    } else if (userInput[1] === 'clear' && userInput[2] === 'messages' && userInput.length === 4) { // clear received messages 
        var userInbox = userInput[0];
        var fromUser = userInput[3];

        if (checkUser(userInbox) === true && checkUser(fromUser) === true) {
          clearMessage(userInbox,fromUser,"received");
          client.write('\n Messages cleared. Enter another command: ');
        }
    } else if (userInput[1] === 'messages' && userInput.length === 2 && checkUser(userInput[0]) == true) {
        var userInbox = userInput[0];
        client.write("\n" + userInbox + "'s Messages\n"); 

        var msgArray = [];
        for (var i = 0; i < dataFile.length; i++) {  
          if (dataFile[i].username === userInbox) {
            for (var key in dataFile[i].received) {
               msgArray.push("From " + key + " - " + dataFile[i].received[key]);
            }
          }
        }
        client.write(msgArray.join('\n'));
        client.write('\n\nEnter another command: ');   
    } else if (userInput[1] === 'sent' && userInput.length === 2 && checkUser(userInput[0]) === true) {
        var userOutbox = userInput[0];
        client.write("\n" + userOutbox + "'s Sent Messages\n"); 

        var msgArray = [];
        for (var i = 0; i < dataFile.length; i++) {  
          if (dataFile[i].username === userOutbox) {
            for (var key in dataFile[i].sent) {
               msgArray.push("To " + key + " - " + dataFile[i].sent[key]);
            }
          }
        }
        client.write(msgArray.join('\n'));
        client.write('\n\nEnter another command: ');    
    } else {
        client.write('\nInvalid command. Enter another command: ');
    }
        //client.end();
  });
});

server.listen(8124, function() { //'listening' listener
  console.log('server bound');
});