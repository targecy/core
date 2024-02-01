// import { TargecyContext } from './misc/Context';
// import { useAccount, useWalletClient } from 'wagmi';
// import { useEffect, useState } from 'react';
// import { NoWalletConnected } from './misc/NoWalletConnected';
// import { relayerTrpcClient } from '../utils/trpc';

// const Txs = () => {
//   const { isConnected } = useAccount();
//   const { data: wallet } = useWalletClient();
//   console.log(wallet);

//   const [fetchTxsTrigger, setFetchTxsTrigger] = useState<boolean>(false);
//   const [txs, setTxs] = useState<any[]>([]);

//   const fetchTxs = async () => {
//     setFetchTxsTrigger(true);
//     wallet?.signMessage({ message: 'list' }).then(async (signature) => {
//       setTxs(await relayerTrpcClient.txs.list.query({ signature }));
//     });
//   };

//   useEffect(() => {
//     if (fetchTxsTrigger) {
//       fetchTxs().finally(() => {
//         setFetchTxsTrigger(false);
//       });
//     }
//   }, [fetchTxsTrigger]);

//   return (
//     <TargecyContext>
//       {isConnected ? (
//         <button
//           className="btn btn-secondary w-full"
//           disabled={fetchTxsTrigger}
//           onClick={() => {
//             setFetchTxsTrigger(true);
//           }}>
//           {fetchTxsTrigger ? 'Requesting...' : 'Request Txs'}
//         </button>
//       ) : (
//         <NoWalletConnected caption="Please connect Wallet"></NoWalletConnected>
//       )}
//       {txs?.map((tx: any) => (
//         <div>{tx.hash}</div>
//       ))}
//     </TargecyContext>
//   );
// };

// export const TargecyTransactions = () => {
//   return (
//     <TargecyContext>
//       <Txs />
//     </TargecyContext>
//   );
// };
