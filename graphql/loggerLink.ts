/* eslint-disable no-console */
import { ApolloLink, Operation, NextLink, FetchResult } from "@apollo/client";
import { Observable } from "@apollo/client/utilities";

const loggerLink = new ApolloLink(
  (operation: Operation, forward: NextLink): Observable<FetchResult> => {
    console.log(`Starting request for ${operation.operationName}`);
    console.log("Query:", operation.query);
    console.log("Variables:", operation.variables);

    return new Observable<FetchResult>((observer) => {
      const subscription = forward(operation).subscribe({
        next: (result: FetchResult) => {
          console.log(`Received response for ${operation.operationName}`);
          console.log("Result:", result);
          observer.next(result);
        },
        error: (error: Error) => {
          console.error(`Error in request for ${operation.operationName}`);
          console.error("Error:", error);
          observer.error(error);
        },
        complete: () => {
          observer.complete();
        },
      });

      return () => {
        subscription.unsubscribe();
      };
    });
  },
);

export default loggerLink;
