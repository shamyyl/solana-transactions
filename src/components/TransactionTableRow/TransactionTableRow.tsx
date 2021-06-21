import React, { FC, useEffect, useState } from 'react';
import { TransactionInfo } from '../../hooks/useAccountHistory';
import { formatSolOutput } from '../../utils/formatSolOutput';
import { lamportsToSol } from '../../utils/lamportsToSol';


import './TransactionTableRow.scss';

interface ITransactionTableRowProps {
  transaction: TransactionInfo;
  rowIndex: number;
}

export const TransactionTableRow: FC<ITransactionTableRowProps> = ({transaction, rowIndex}) => {
  const {signature, blockTime, postBalance, delta, success} = transaction;
  const deltaSol = lamportsToSol(delta.toNumber());
  const deltaSign = delta.gt(0) ? '+' : '-';

  const postBalanceSol = lamportsToSol(postBalance);
  const [showRow, setShowRow] = useState(false);
  useEffect(() => {
    setTimeout(() => setShowRow(true), (rowIndex % 25) * 30)
  }, []);

  return (
    <tr key={signature} className={showRow ? 'transaction-row show-row' : 'transaction-row'}>
      <td>{signature}</td>
      <td>{blockTime ? new Date(blockTime * 1000).toDateString() : 'No date'}</td>
      <td>{formatSolOutput(postBalanceSol)}</td>
      <td><span className={delta.gt(0) ? 'positive-delta' : 'negative-delta'}>{deltaSign}{formatSolOutput(deltaSol)}</span></td>
      <td><span className={success ? 'success-status' : 'error-status'}>{success ? 'success' : 'error'}</span></td>
    </tr>
  )
};