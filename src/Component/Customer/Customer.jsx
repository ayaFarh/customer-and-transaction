import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function Customer() {
  const [customersData, setCustomersData] = useState([]);
  const [error, setError] = useState(null);
  const[filterName,setfilterName] =useState('')
  const[filterAmount,setfilterAmount] =useState('')
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetch('/customer-and-transaction/db.json') 
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        
        const mergedData = data.customers.map(customer => {
          const customerTransactions = data.transactions.filter(transaction => transaction.customer_id === customer.id);
          return {
            ...customer,
            transactions: customerTransactions
          };
        });
        setCustomersData(mergedData);
        setFilteredData(mergedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.toString());
      });
  }, []);
  useEffect(() => {
    applyFilters();
  }, [filterName, filterAmount, customersData]);

  
  let applyFilters =() => {
    let filterd = customersData;
    if(filterName.trim() !== ''){
        filterd = filterd.filter(customer => customer.name.toLowerCase().includes(filterName.toLowerCase()))
    }
    if (filterAmount.trim() !== '') {
        filterd = filterd.filter(customer =>
          customer.transactions.some(transaction =>
            transaction.amount.toString().includes(filterAmount.trim())
          )
        );
      }
  setFilteredData(filterd);
  }

  const handleFilterName = event=> {
    setfilterName(event.target.value)
  }
  const handleFilterAmount = event=> {
    setfilterAmount(event.target.value)
  }
  const handleCustomerSelect = customer => {
    setSelectedCustomer(customer);
  };

  const getChartData = () => {
    if (!selectedCustomer) return {};

    const transactionData = selectedCustomer.transactions.reduce((acc, transaction) => {
      const date = transaction.date;
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += transaction.amount;
      return acc;
    }, {});

    const labels = Object.keys(transactionData);
    const data = Object.values(transactionData);

    return {
      labels,
      datasets: [
        {
          label: 'Total Transaction Amount per Day',
          data,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    };
  };

  return (
    <>
      <div className='py-12 flex flex-col justify-center items-center w-full'>
        <h1 className='text-gitty text-3xl font-bold mb-6 text-center'>Customer List with Transactions</h1>
        <input  type='text' name='name' value={filterName} onChange={handleFilterName}  placeholder='Search by Name' className='w-[80%] border border-1 border-gray-500 rounded mb-4 py-1 px-2' />
        <input  type='text' name='amount'  value={filterAmount} onChange={handleFilterAmount} placeholder='Search by Amount' className='w-[80%] border border-1 border-gray-500 rounded mb-4 py-1 px-2' />
        {error && <p className="text-red-500">Error: {error}</p>}
        <table className='border-2 shadow-2xl mb-4  w-[80%] rounded-xl overflow-hidden'>
          <thead className='border-2 text-center '>
            <tr className='bg-gitty text-center'>
              <th className='p-2 '>ID</th>
              <th className='p-2 '>Name</th>
              <th className='p-2 '>Transactions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((customer, index) => (
              <React.Fragment key={customer.id}>
                <tr className={`${index % 2 === 0 ? 'bg-white' : 'bg-whitegitty'} border-2 text-center`} onClick={() => handleCustomerSelect(customer)}>
                  <td className='p-2 '>{customer.id}</td>
                  <td className='p-2 cursor-pointer'>{customer.name}</td>
                  <td colSpan="3">
                    <table className=' w-full'>
                      <thead className=''>
                        <tr className='text-center'>
                          <th className='p-2  text-nowrap'>Transaction ID</th>
                          <th className='p-2 '>Amount</th>
                          <th className='p-2 '>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customer.transactions.map(transaction => (
                          <tr key={transaction.id} className='text-center'>
                            <td className='p-2'>{transaction.id}</td>
                            <td className='p-2'>{transaction.amount}</td>
                            <td className='p-2 '>{transaction.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>



        {selectedCustomer && (
          <div className='w-[80%] mt-8'>
            <h2 className='text-2xl font-bold mb-4'>Transaction Chart for{selectedCustomer.name}</h2>
            <Line data={getChartData()} />
          </div>
        )}
      </div>

    </>
  );
}
