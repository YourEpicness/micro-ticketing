# micro-ticketing
---
## Technology Stack
- React
- Node (Express)
- Typescript
- Docker
- Kubernetes

### Important Considerations

##### Parsing errors across microservices
- Consistently structured response from all servers for errors... and everything
- Solution: Write error handling middleware to process errors which give them a consistent structure and sends back to the browser
