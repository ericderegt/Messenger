#TCP Messenger_Experiment
#####TCP Messenger_Experiment is similar to TCP Messenger in that it lets you create an account where you can send and receive messages with other users. The major difference is that a user can log-in.

**create** - Lets you create an account. Just type create followed by your desired username. You will be notified if the desired username already exists. Usernames must be one word, but can have underscores.

```bash
create username
```

**login** - Lets you login to your account. Type login followed by your username.

```bash
login eric
```

**messages** - Shows you the messages associated with your account. You can add a username after messages to see messages from just one other user.

```bash
messages anna

eric's Messages from anna
- Gonna make a book review app
- Just kidding... making a cheese app now
```

**list** - Shows list of all registered users.
```bash
list

User List
- eric
- anna
- sean
```

**send** - Send a message to another user. Just type your username, the username of whoever you want to send a message to follow by the message!

```bash
send anna great idea

Sent "great idea" to anna
```

**sent** - See sent messages. As above, enter username to just see sent messages to one user.

```bash
sent anna

eric's messages to anna
- great idea
```

**clear** - Use this to clear received or sent messages with a specific user.

```bash
clear messages anna

Messages from anna
```

```bash
clear sent anna

Messages to anna
```
