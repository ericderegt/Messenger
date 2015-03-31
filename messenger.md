#TCP Messenger
#####TCP Messenger lets you create an account where you can send and receive messages with other users.

**create** - Lets you create an account. Just type create followed by your desired username. You will be notified if the desired username already exists. Usernames must be one word, but can have underscores.

```bash
create username
```

**messages** - Shows you the messages associated with your account. You can add a username after messages to see messages from just one other user.

```bash
eric messages anna

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
 eric send anna great idea

Sent "great idea" to anna
```

**sent** - See sent messages. As above, enter username to just see sent messages to one user.

```bash
eric sent anna

eric's messages to anna
- great idea
```

**clear** - Use this to clear received or sent messages with a specific user.

```bash
eric clear messages anna

Messages from anna
```

```bash
eric clear sent anna

Messages to anna
```
