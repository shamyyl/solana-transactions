import { useState } from 'react';

import { TransactionTableRow } from '../TransactionTableRow/TransactionTableRow';
import { useAccountTransactions } from '../../hooks/useAccountHistory';

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
                {accountTransactions.map((transactionInfo, index) => 
                  <TransactionTableRow transaction={transactionInfo} rowIndex={index} key={`transaction-row-${index}`}/>
                )}
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