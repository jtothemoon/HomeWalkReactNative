import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';

const App = () => {
  const [stepsData, setStepsData] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await axios.get('http://192.168.91.224:3000/steps');
        setStepsData(response.data);
      } catch (error) {
        console.error('Error fetching initial steps data:', error);
      }
    };

    const setupWebSocket = () => {
      wsRef.current = new WebSocket('ws://192.168.91.224:3001');
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setStepsData(data);
      };
    };

    fetchInitialData();
    setupWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const getLatestStepsById = (data) => {
    const latestData = {};
    data.forEach(item => {
      latestData[item.userId] = item.steps;  // 가장 최신의 steps 값으로 덮어씌웁니다.
    });
    return Object.keys(latestData).map(userId => ({ userId, steps: latestData[userId] }));
  };

  const latestStepsData = getLatestStepsById(stepsData);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Steps Tracker</h1>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={latestStepsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="steps" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </header>
    </div>
  );
};

export default App;

