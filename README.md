# micro-ticketing
---
## Technology Stack
- React
- Node (Express)
- Typescript
- Docker
- Kubernetes

### Important Considerations

##### Testing
- Testing proper input validation for signup microservices
##### Parsing errors across microservices
- Consistently structured response from all servers for errors... and everything
- Solution: Write error handling middleware to process errors which give them a consistent structure and sends back to the browser 
- Capture all possible errors using Express's error handling mechanism
- [Docs Reference](https://expressjs.com/en/guide/error-handling.html)

## Encoding Errors
- We build subclasses to handle the error for each reason and pass it through the middleware to determine what errors to throw, and if it fails most of them, send a generic error
- We set up a common response structure for any errors. This is typically an array that is created from our ErrorType class.
- Notice of duplicated code for error handling. Better way to do is to create a method on the class to serializeError() with specific status codes and error structure
- Notice duplicated code on second refactor. After moving logic into respective classes we are left with very similiar statements. One more refactor is needed to place logic in a function that takes an error as input and returns the status code and message as output.
- We need to make sure our classes implement the method properly alongside the proper status code. One way is to use an interface to ensure statusCode gives a Number and serializeError returns type Array. We can append implements custom error interface to the class
Example: Interface Implementation
```
// serializeErrors takes an array of objects with a required message, and an optional field value
interface CustomError {
    statusCode: number;
    serializeErrors(): {
        message: string;
        field?: string;
    }[]
}
```
- Option 2: Use an abstract class for each error types. Abstract class is useful in this case because interfaces will not exist when compiled to JS. Abstract classes will remain which allow us to utilize the instanceof statement for checks.
- throw new Error('') is still very useful for server logs. It is called in the super(). We can pass in a message through the abstract class's super().
- Currently, code is refactored so that there is no duplicate code in the middleware and proper type declarations are created.
- Problem: Can't catch asynchronous errors. Solution: use express async errors npm package to allow async/await usage

## Mongoose and Typescript
- To get mongoose and typescript to work peropely together create a function called buildExample and pass in the interface that matches the model like below
    ```
    const buildUser = (attr: UserAttrs) => {
        return new User(attrs);
    }
    ```
- Another almost better improvement is to define a usermodel interface so Typescript plays nice
    ```
    interface UserModel extends mongoose.Model<any> {
        build(attrs: UserAttrs): any;
    }

    const User = mongoose.model<any,UserModel>('User', userSchema);

    // to test typescript
    User.build({
        email: 'test@test.com',
        password: 'password'
    })
    ```
- Angle brackets are generic syntax for typescript which allows for assigning types in a class and stuff

Classes
- static methods are methods accessible without having to create an instance of the class

Password Hashing/ Auth Service
- passwords SHOULD NOT be stored in plain text in the database
- We have to hash the password somehow and store into the database
- libraries such as crypto provide useful ways to hash passwords and other things. 
- Downside is that crypto is a callback library which is synchronous, so we need to use a library such as promisify to convert it into a Promise which is asynchronous to be used in the appplication

## Authentication Strategies
Note: sync request refers to directly talking to another service

Approaches to handling authentication
1. Individual services rely on some central auth service. We have cookie, JWT, etc and send to the auth service. Auth service would contain logic to decide if user us authenticated. 
   - Downside is that since its synchronous, if the auth service connection goes down, the whole applicaiton goes down. This option promotes tight coupling.
   1.1. Individual services use auth service as a gateway/proxy. Same problems still apply.
2. Individual services know how to authenticate a user. Ex: if there is a request to purchase a ticket, the order service would have the logic available to determine whether the user is authenticated or not. This causes duplication of auth logic which could also be used in a shared library for other services.
   - Upside: not relying on auth service. Auth service could fail and logic for the order service would still work
   - Downside: Updating user permissions won't work because the service is decoupled. Any requests that would require some information from the database won't work since auth logic is already inside the service