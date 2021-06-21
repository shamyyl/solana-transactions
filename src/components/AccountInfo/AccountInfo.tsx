import { useState } from 'react';

import { useAccountTransactions } from '../../hooks/useAccountHistory';
import { lamportsToSol } from '../../utils/lamportsToSol';
import { formatSolOutput } from '../../utils/formatSolOutput';

import './AccountInfo.scss';

export const AccountInfo = () => {
  // const address = '8YmMhex5Vd5JPsyNhCwFPDx5vqeedpCuyFE2W7VtRXQT';
  const [address, setAddress] = useState('8YmMhex5Vd5JPsyNhCwFPDx5vqeedpCuyFE2W7VtRXQT');
  const {accountTransactions, findTransactions} = useAccountTransactions(address);

  return (
    <section className='account-info-section'>
      <div className='account-info'>
        <div className='address-input'>
          <input type='text' placeholder='Account address' value={address} onChange={(e) => setAddress(e.target.value)} />
          <button type='button' onClick={findTransactions} className='search-button'>Find</button>
        </div>
        {accountTransactions.length > 0 && (
          <>
            <div className='table-wrapper'>
              <table>
                <thead>
                  <tr>
                    <td>Signature</td>
                    <td>Time</td>
                    <td>Post balance</td>
                    <td>Delta</td>
                    <td>Status</td>
                  </tr>
                </thead>
                <tbody>
                {accountTransactions.map(({signature, blockTime, postBalance, delta, success}) => {
                  const deltaSol = lamportsToSol(delta.toNumber());
                  const deltaSign = delta.gt(0) ? '+' : '-';

                  const postBalanceSol = lamportsToSol(postBalance);
                  return (
                    <tr key={signature}>
                      <td>{signature}</td>
                      <td>{blockTime ? new Date(blockTime * 1000).toDateString() : 'No date'}</td>
                      <td>{formatSolOutput(postBalanceSol)}</td>
                      <td><span className={delta.gt(0) ? 'positive-delta' : 'negative-delta'}>{deltaSign}{formatSolOutput(deltaSol)}</span></td>
                      <td><span className={success ? 'success-status' : 'error-status'}>{success ? 'success' : 'error'}</span></td>
                    </tr>
                  )
                })}
                </tbody>
              </table>
            </div>
            <button type='button' onClick={findTransactions}>Load More</button>
          </>
        )}
      </div>
    </section>
  );
};