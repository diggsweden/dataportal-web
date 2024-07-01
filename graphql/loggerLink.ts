import { ApolloLink, Operation, NextLink, FetchResult } from "@apollo/client";
import { Observable } from "apollo-link";

const loggerLink = new ApolloLink((operation: any, forward: any) => {
  console.log(`Starting request for ${operation.operationName}`);
  console.log('Query:', operation.query);
  console.log('Variables:', operation.variables);

  return new Observable<FetchResult>((observer) => {
    const subscription = forward(operation).subscribe({
      next: (result: any): void => {
        console.log(`Received response for ${operation.operationName}`);
        console.log("Result:", result);
        observer.next(result);
      },
      error: (error: any) => {
        console.error(`Error in request for ${operation.operationName}`);
        console.error("Error:", error);
        observer.error(error);
      },
      complete: observer.complete.bind(observer),
    });

    return () => {
      subscription.unsubscribe();
    };
  });
});

export default loggerLink;
