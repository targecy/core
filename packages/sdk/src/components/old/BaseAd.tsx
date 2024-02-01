// import React, { useCallback, useState } from 'react';
// import { createWalletClient, custom } from 'viem';
// import { polygonMumbai } from 'viem/chains';

// import { useCredentials, useTargecyContext } fro../../hooksoks';
// import { backendTrpcClient, cloneCredential } fro../../utilsils';
// import { environment } fro../../utils/contextext';

// import AdLayout, { type AdLayoutProps } from './AdLayout';

// const signMessage = 'Sign this message to verify your wallet and start earning rewards.'; // @todo (Martin): Should add a nonce?

// export type BaseAdProps = AdLayoutProps & {
//   isLoading?: boolean;
//   env: environment;
// };

// export const BaseAd = (props: BaseAdProps) => {
//   const { env, ...adLayoutProps } = props;

//   const { context, initialized } = useTargecyContext();
//   const { credentials, setCredentials } = useCredentials(context);
//   const [fetchingCredentials, setFetchingCredentials] = useState(false);
//   const [credentialsFetched, setCredentialsFetched] = useState(false);

//   const signAndEarnRewards = useCallback(() => {
//     const client = createWalletClient({
//       chain: polygonMumbai,
//       transport: custom(window.ethereum),
//     });

//     void client.getAddresses().then(([account]) =>
//       client
//         .signMessage({
//           account,
//           message: signMessage,
//         })
//         .then((signature) => {
//           // Onboarding User
//           if (!initialized) throw new Error('Context not initialized');
//           const did = context.userIdentity?.did.id;
//           if (!did) throw new Error('Identity not initialized');
//           setFetchingCredentials(true);

//           backendTrpcClient(env)
//             .credentials.getPublicCredentials.query({ message: signMessage, signature, did, wallet: account })
//             .then((credentials: any) => {
//               setCredentials(credentials.map(cloneCredential));
//               setFetchingCredentials(false);
//               setCredentialsFetched(true);

//               // @todo (Martin): refresh ad?
//             })
//             .catch(() => {
//               setFetchingCredentials(false);
//               setCredentialsFetched(true);
//               console.log('Error retrieving public-data credentials.');
//             });
//         })
//         .catch(() => {
//           console.log('Error signing message.');
//         })
//     );
//   }, [context, initialized, setCredentials, env]);

//   return (
//     <AdLayout {...adLayoutProps}>
//       {!credentialsFetched &&
//         (fetchingCredentials ? (
//           <label>Fetching...</label>
//         ) : (
//           !credentials.length && (
//             <label
//               onClick={signAndEarnRewards}
//               className="mt-2 mb-1"
//               style={{
//                 cursor: 'pointer',
//               }}>
//               Verify wallet and start earning rewards
//             </label>
//           )
//         ))}
//     </AdLayout>
//   );
// };

// export default React.memo(BaseAd);
