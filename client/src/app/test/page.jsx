'use client';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
const Test = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    console.log('Fetching data...');
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/test/pingAll`);
    const data = await res.json();
    console.log('Data fetched:', data);
    setData(data);
  };

  return (
    <div className="flex flex-col items-center mt-45 h-screen">
      <h1 className="text-2xl font-bold">Test Page</h1>
      <p className="text-lg">This is a test page to check the API response.</p>
      <div className="flex flex-col items-center justify-center mt-24">
        <h2 className="text-xl font-bold">API Response:</h2>
        {data ? <p>{JSON.stringify(data)}</p> : <p>Loading...</p>}

        {data && (
          <div>
            <p>Data loaded successfully!</p>
            <Button onClick={fetchData}>Refresh Data</Button>
            <br />
            <Button onClick={() => setData(null)}>Clear Data</Button>
            <br />
            <Button onClick={() => console.log(data)}>Log Data</Button>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center mt-24">
        <Button onClick={() => window.history.back()}>Move Back</Button>
      </div>
    </div>
  );
};

export default Test;
