import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { getRevlog } from '../util/apicalls';
import { BarChart, Bar } from 'recharts';
import './ByHourGraph.css';

export default function(props) {
  const { userId, className, ...other } = props;
  const [data, setData] = useState();

  useEffect(() => {
    getRevlog(userId).then(data => {
      setData(data);
    });
  }, []);

  return (
    <Card {...other} className={`bar-graph-card ${className}`}>
      <Card.Header>Reviews By Hour</Card.Header>
      <Card.Body className="d-flex align-items-center justify-content-center">
        <div className="bar-graph">
        {
          data && 
          <BarChart width={400} height={400} data={data}>
            <Bar dataKey="count"/>
          </BarChart>
        }
        </div>
      </Card.Body>
    </Card>
  )
}