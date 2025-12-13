import { ErrorLink } from "@apollo/client/link/error";
import {
  CombinedGraphQLErrors,
  CombinedProtocolErrors,
} from "@apollo/client/errors";

export const errorLink = new ErrorLink(({ error, operation }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, path }) => {
      console.error(`GraphQL error in ${operation.operationName}:`, message);
      if (path) console.error("Path:", path);
    });
  } else if (CombinedProtocolErrors.is(error)) {
    error.errors.forEach(({ message, extensions }) => {
      console.error(
        `Protocol error in ${operation.operationName}:`,
        message,
        extensions ? `Extensions: ${JSON.stringify(extensions)}` : ""
      );
    });
  }
  // Handle network errors
  else {
    console.error(`Network error in ${operation.operationName}:`, error);

    //We try to detect authentication errors if they occur in the future when implementing JWT.
    const statusCode = (error as any)?.statusCode;
    if (statusCode === 401 || statusCode === 403) {
      console.warn("Authentication failed - session expired");
      //TODO: Add your logout logic here
    }
  }
});

export default errorLink;
