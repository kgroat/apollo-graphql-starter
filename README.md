# Apollo Graphql Starter Project

## Quickstart

### Dependency installation
```bash
$ npm install
```

### Starting the app in watch mode
```bash
$ npm start dev
```

### Checking the validity of the app
```bash
# unit tests
$ npm test

# lint the app code
$ npm start lint
```

### Interactive scripts
```bash
$ npm run interactive
```


## Debugging using VSCode
1. Run `npm start dev` in a terminal
1. Go to the debugger menu and launch the `Node: Nodemon` configuration.

## API Rundown
After starting the application, you can go to `http://localhost:3000` to view a graphical interface for making  GraphQL requests directly to the server.  You can use the `SCHEMA` tab to the right of the window to explore the various operations that can be executed on the GraphQL endpoint.

You should start by creating a user.  To do that, execute the following mutation:
```graphql
mutation CreateUser {
  createUser(
    username: "some_user",
    password: "this is a very secure password",
    verifyPassword: "this is a very secure password",
  ) {
    _id
    username
  }
}
```

After this, you can then get a JWT token by executing the following mutation:
```graphql
mutation Login {
  login(
    username: "some_user",
    password: "this is a very secure password",
  ) {
    token
  }
}
```

Copy the value from the `"token"` key in the output, and use it to set the `HTTP HEADERS` at the bottom left of the window like so:
```json
{
  "authorization": "Bearer [your token here]"
}
```

Once you have this header in place, you can then create a post by executing the following mutation:
```graphql
mutation CreatePost {
  createPost(content: "Hello, World!") {
    _id
    content
    poster {
      username
    }
  }
}
```

Take the `"_id"` value from the output and execute the following subscription:
```graphql
subscription Post {
  post(
    postId: "[your post._id here]"
  ) {
    content
    poster {
      username
    }
  }
}
```

You should see the post you just created.  You will also notice that the button in the middle of the window has changed from a play button to a stop button.  This means that there is an active subscription, and any new data passed to the subscription will automatically show up as a new frame in the underlying websocket.


To see this in action, open a separate tab/window to `http://localhost:3000` and execute the following mutation:
```graphql
mutation UpdatePost {
  updatePost(
    postId: "5b98847082705bbdd934505d",
    data: {
      content: "Foo"
    }
  ) {
    content
  }
}
```

Now, returning to the first tab/window with the active subscription should show a second entry for the updated post.
