// TCP Messenger
// Structure of this file is as follows:
//   1. Variable declaration
//   2. Functions
//   3. Control flow for user input to server

// Variable declaration
var net = require('net'),
    fs = require('fs'),
    server = net.createServer(),
    loggedin = false,
    currentUser;
    dataFile = JSON.parse(fs.readFileSync('./messages.json', 'utf8'));

// messageLog writes data to json file
function messageLog (data) {
    fs.writeFileSync('./messages.json', JSON.stringify(data), 'utf8');
}

// checkUser gets called when someone tries to create a username
function checkUser (user1) {
    for(var i = 0; i < dataFile.length; i++) {
        if (dataFile[i].username === user1) {
            return true;  
        } 
    }
    return false;  
}

// sendMessage adds msgString to sent object for sender and received object for receiver
function sendMessage (sender,receiver,msgString) {
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
function clearMessage (user1, user2, type) {
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

//createUser function creates a new username
function createUser (username) {
    var newUser = {};
    newUser.username = username;
    newUser.sent = {};
    newUser.received = {};
    dataFile.push(newUser);
    messageLog(dataFile);
}

// Start of server connection
server.on('connection', function(client) { //'connection' listener
    console.log('client connected');
    client.setEncoding('utf8');
    client.write('Welcome to TCP Messenger. Enter a command to continue: ');

    client.on('data', function(input) {
        var userInput = input.trim().split(' ');
        var command = userInput[0];

        if (loggedin === false) {
            switch (command) {
                case 'create':
                    if (checkUser(userInput[1]) === true) {
                        client.write('\nUsername already exists. Please choose another name. Type list to see current users. Or type create "username" to select another username\n');    
                    } else {
                        createUser(userInput[1]);
                        client.write("\nThe username " + userInput[1] + " has been created! \nEnter another command to continue: ");
                    }
                    break;
                case 'login':
                    if (checkUser(userInput[1]) === true) {
                        loggedin = true;
                        currentUser = userInput[1];
                        console.log(loggedin);
                        client.write("\nUser " + currentUser + " has logged in! \nEnter another command to continue: ");
                    }
                        break;
                default:
                    client.write("\nPlease create an account or login to continue!\n");
            }
        } else {
            switch (command) {
                case 'list':
                    client.write('\nUser List\n');
                
                    for (var i = 0; i < dataFile.length; i++) {
                        client.write('- ' + dataFile[i].username + "\n");
                    }
                    client.write('\nEnter another command: ');
                    break;
                case 'send':
                    var receiver = userInput[1];
                    var msgInput = userInput;
                    msgInput.splice(0,2);
                    var msgString = msgInput.join(' ');

                    if (checkUser(currentUser) === true && checkUser(receiver) === true) {
                        sendMessage(currentUser,receiver,msgString); //calls sendMessage function with user's input
                        client.write("\nSent '" + msgString + "' to " + receiver + "\n");
                        client.write('\nEnter another command: ');
                    } else {
                        client.write('\nPlease enter valid usernames!\nEnter another command: ');
                    }
                    break;
                case 'messages':
                    if (userInput.length === 1) {
                        client.write("\n" + currentUser + "'s Messages\n"); 

                        var msgArray = [];
                        for (var i = 0; i < dataFile.length; i++) {  
                            if (dataFile[i].username === currentUser) {
                                for (var key in dataFile[i].received) {
                                    msgArray.push("From " + key + " - " + dataFile[i].received[key]);
                                }
                            }
                        }
                        client.write(msgArray.join('\n'));
                        client.write('\n\nEnter another command: ');   
                    } else {
                        var fromUser = userInput[1];

                        if (checkUser(fromUser) === true) {
                            client.write("\n" + currentUser + "'s messages from " + fromUser + "\n"); 

                            for (var i = 0; i < dataFile.length; i++) {
                                if (dataFile[i].username === currentUser) {
                                    dataFile[i].received[fromUser].forEach(function(element) {
                                        client.write('- ' + element + '\n');
                                    });
                                }        
                            }
                            client.write('\n Enter another command: ');
                        } else {
                            client.write('\nPlease enter valid usernames!\nEnter another command: ');
                        }
                    } 
                    break;
                case 'sent': 
                    if (userInput.length === 1) {
                        client.write("\n" + currentUser + "'s Sent Messages\n"); 

                        var msgArray = [];
                        for (var i = 0; i < dataFile.length; i++) {  
                            if (dataFile[i].username === currentUser) {
                                for (var key in dataFile[i].sent) {
                                    msgArray.push("To " + key + " - " + dataFile[i].sent[key]);
                                }
                            }
                        }
                        client.write(msgArray.join('\n'));
                        client.write('\n\nEnter another command: ');    
                    } else {
                        var toUser = userInput[2];

                        if(checkUser(toUser) === true) {
                            client.write("\n" + currentUser + "'s messages to " + toUser + "\n"); 

                            for (var i = 0; i < dataFile.length; i++) {
                                if (dataFile[i].username === currentUser) {
                                    dataFile[i].sent[toUser].forEach(function(element) {
                                        client.write('- ' + element + '\n');
                                    });
                                }        
                            }
                            client.write('\n Enter another command: ');
                        } else {
                            client.write('\nPlease enter valid usernames!\nEnter another command: ');
                        }
                    }
                    break;
                case 'clear':
                    if (userInput[1] === 'sent' && userInput.length === 3) { // clear sent messages
                        var toUser = userInput[2];

                        if (checkUser(toUser) === true) {
                            clearMessage(currentUser,toUser,"sent");
                            client.write('\n Messages cleared. Enter another command: ');
                        }
                    } else if (userInput[1] === 'messages' && userInput.length === 3) { // clear received messages 
                        var fromUser = userInput[2];

                        if (checkUser(fromUser) === true) {
                            clearMessage(currentUser,fromUser,"received");
                            client.write('\n Messages cleared. Enter another command: ');
                        }
                    }
                    break; 
                default:
                    client.write('\\nInvalid command. Enter another command: ');
            }
            //client.end();
        }
  });
});

server.listen(8124, function() { //'listening' listener
    console.log('server bound');
});