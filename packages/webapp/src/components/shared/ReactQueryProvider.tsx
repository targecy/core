import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools initialIsOpen={false} />
      <Hydrate state={pageProps.dehydratedState}>{children}</Hydrate> */}
      {children}
    </QueryClientProvider>
  );
}
