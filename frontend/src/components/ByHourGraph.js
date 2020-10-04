import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { getRevlog } from '../util/apicalls';
import { BarChart, Bar } from 'recharts';
import { useWorker } from '@koale/useworker';
import './ByHourGraph.css';

export default function(props) {
  const { userId, className, ...other } = props;
  const [data, setData] = useState();

  const process = revlog => {
    console.log(revlog);
    const bars = Array(24).fill(0);
    revlog.forEach(review => {
      bars[new Date(review.id).getHours()] += 1;
    })
    return (
      Object.keys(bars).map(key => ({
        name: key,
        value: bars[key]
      }))
    );
  }

  const [worker] = useWorker(process);
  useEffect(() => {
    (async () => {
      const revlog = await getRevlog(userId);
      const d = await worker(revlog);
      setData(d);
    })();
  }, []);

  return (
    <Card {...other} className={`bar-graph-card ${className}`}>
      <Card.Header>Reviews By Hour</Card.Header>
      <Card.Body className="d-flex align-items-center justify-content-center">
        <div className="bar-graph">
        {
          data && 
          <BarChart width={400} height={400} data={data}>
            <Bar dataKey="value"/>
          </BarChart>
        }
        </div>
      </Card.Body>
    </Card>
  )
}