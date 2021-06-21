import { useState } from 'react';
import {
  PublicKey,
  Connection
} from "@solana/web3.js";
import { BigNumber } from "bignumber.js";
import { useEffect } from 'react';

export interface TransactionInfo {
  signature: string;
  blockTime: number | null | undefined;
  postBalance: number;
  delta: BigNumber;
  success: boolean;
}

export function useAccountTransactions(address: string) {
  const [accountTransactions, setAccountTransactions] = useState<TransactionInfo[]>([]);
  const [lastSignature, setLastSignature] = useState<string>();
  
  const findTransactions = async () => {
    const rowsInfo = await getAccountHistory(address, lastSignature, setLastSignature);
    setAccountTransactions([...accountTransactions, ...rowsInfo]);
  };

  useEffect(() => {
    setAccountTransactions([]);
  }, [address]);
  return {accountTransactions, findTransactions};
}

const getAccountHistory = async (address: string, lastSignature: string | undefined, setLastSignature: (sign: string) => void) => {
  const rowsInfo = [] as TransactionInfo[];
  
  if (address.length > 0) {
    const pubkey = new PublicKey(address);
    const connection = new Connection('http://api.mainnet-beta.solana.com/');
    const confirmedSignaturesForAdress = await connection.getConfirmedSignaturesForAddress2(
      pubkey,
      {
        before: lastSignature,
        limit: 25
      }
    )
    const signaturesList = confirmedSignaturesForAdress.map(({signature}) => signature);
    setLastSignature(signaturesList[signaturesList.length - 1]);
    const parsedConfirmedTransactions = await connection.getParsedConfirmedTransactions(signaturesList);
  
    const parsedInfoForAdress = parsedConfirmedTransactions
      .filter(parsedConfirmedTransaction => !!parsedConfirmedTransaction)
      .map((parsedConfirmedTransaction) => {
        const {meta, transaction} = parsedConfirmedTransaction!;
        const indexOfTransaction = transaction.message.accountKeys.findIndex(({pubkey}) => pubkey.toBase58() === address);
  
        const postBalance = meta?.postBalances[indexOfTransaction];
        const preBalance = meta?.preBalances[indexOfTransaction];
  
        return {
          postBalance,
          preBalance
        }
      });
  
    confirmedSignaturesForAdress.forEach(({blockTime, signature, err}, index) => {
      const {postBalance, preBalance} = parsedInfoForAdress[index];
      const delta = postBalance && preBalance ? new BigNumber(postBalance).minus(new BigNumber(preBalance)) : new BigNumber(0);
      const row = {
        signature,
        blockTime,
        postBalance: postBalance || 0,
        delta,
        success: !err
      };
      rowsInfo.push(row);
    });
  
    console.log(confirmedSignaturesForAdress);
    console.log(lastSignature, signaturesList);
    console.log(parsedConfirmedTransactions);
    console.log(rowsInfo);
  } 
  
  return rowsInfo;
};