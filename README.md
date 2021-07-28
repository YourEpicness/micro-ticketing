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