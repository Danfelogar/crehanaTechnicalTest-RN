import { ApolloLink } from "@apollo/client";
import { map } from "rxjs";

export const loggerLink = new ApolloLink((operation, forward) => {
  const startTime = Date.now();
  const operationName = operation.operationName || "UnnamedOperation";

  console.log(`🚀 [GraphQL] ${operationName} started`);

  return forward(operation).pipe(
    map((result) => {
      const duration = Date.now() - startTime;

      if (result.errors) {
        console.error(
          `❌ [GraphQL] ${operationName} failed (${duration}ms):`,
          result.errors
        );
      } else {
        console.log(`✅ [GraphQL] ${operationName} completed (${duration}ms)`);
      }

      return result;
    })
  );
});

export default loggerLink;
