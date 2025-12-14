import { SetContextLink } from '@apollo/client/link/context';

export const authHttpLink = new SetContextLink(
  async (prevContext, _operation) => {
    //TODO: extract token or whatever auth mechanism from mmkv
    // const token = ....
    const timestamp = Date.now();

    return {
      headers: {
        ...prevContext.headers,
        // authorization: token ? `Bearer ${token}` : "",
        'x-timestamp': timestamp.toString(),
      },
    };
  },
);
