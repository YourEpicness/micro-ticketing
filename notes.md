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
Both these approaches can be brought back to the CAP theorem. We are sacrificing consistency or availability in either of these solutions while keeping partition tolerance due to the nature of microservices. Option #1 though also sacrifices partition tolerance due to its synchronous nature of getting information. It would be more commonly seen in monolithic applcations.

### Option 2 Security Risk
- Security risk due to changes not being updated. For example, if wanting to ban a malicious user, then changes would not be reflected in main app since the token is already sent to the user and there is no way to access the user's token once it's sent to the client.
- Solution 1(Sync): Add a TTL(time to live) for the tokens so that it expires after x amount of time. Once the user's token expires, it would reach out the auth service and refresh the token with updated access control.
- Solution 2(Async): Once the token is expired, the user has to "login" from the auth service to refresh the token instead of server-side doing it.

- Message Queue Solution: Emit a banned user event that is stored into an in memory cache of each service that records the banned user. It's short-lived because services only need to hold the information for the same duration as the TTL for the token. Once the token expires, the user will have to refresh the token and proper access control is applied and the data stored in the services is no longer needed.


## Cookies vs JWTs
- Cookies involve a set-cookie header that can be stored inside the browser that is sent in a response from the server. Once the browser sends a request, the cookie-header is appended to the request and sent back to the server.
- JWT's involve a JWT creation algorithm to form a token from the user information stored. An authorization header is sent with requests, or the token can be stored in the body, or the JWT can be stored in a cookies.
- Cookies are a transport mechanism, moves any kind of data between browser and server, and automatically managed by the browser
- JWTs are about authorization and authentication, it stores any data we want, and we have to manage it manually on the frontend.

Auth Requirements
- needs to be implementeable and understood by many languages
-  Must be able to tell details about a user and must not require some backing data store on server
-  Must be able to handle authoization info
-  Must have a built-in temper resistant way to expire or invalidate itself
-  This can all be satisfied by JWT

Communication method: JWT using cookies to transport
- once a react app asks for data, we need authentication
- Server Side Rendering - get request to the client which is on the server, and a fully rendered HTML file with content is sent back as a response
- Information HAS to be stored in a cookie to retrieve data on page load from the server. Service workers are a possibility.
- Cookie problems:
  - Encryption of cookies across languas is different. Solution: We won't encrypt the cookie contents. Not a problem, because we are storing auth information as JWT, so no security risks.
JWT Signing Key is most important. needs to not be in plain-text. can be stored in .env or as a secret in docker.

### Kubernetes Secrets
- we can assign a JWT key as a secret and plug it into the env variables in each pod
- To create a kubernetes secret (imperative approach)
` kubectl create secret generic jwt-secret --from-literal=jwt=signingkey `
- Declarative approach uses a .env

### JSON Response
- can manually adjust what we stringify by using toJSON() in object instead of JSON.stringify()
```
userSchema.set('toJSON', {
    transform(doc:any, ret:any) {
        ret.id = ret.__id;
        delete ret._id;
        delete ret.entry
    }
})
```
