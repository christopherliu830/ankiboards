import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { getRevlog } from '../util/apicalls';
import { VictoryChart, VictoryTheme, VictoryBar } from 'victory';
import './ByHourGraph.css';

export default function(props) {
  const { userId } = props;
  const [data, setData] = useState();

  useEffect(() => {
    return getRevlog(userId).then(revlog => {
      console.log(revlog);
      const bars = Array(24).fill(0);
      revlog.forEach(review => {
        bars[new Date(review.id).getHours()] += 1;
      })
      setData(bars);
    })
  }, [userId]);

  return (
    <Card {...props} className={`bar-graph-card ${props.className}`}>
      <Card.Header>Reviews By Hour</Card.Header>
      <Card.Body className="d-flex align-items-center justify-content-center">
        <div className="bar-graph">
        {
          data && 
          <VictoryChart 
            theme={VictoryTheme.victoryTheme} height={400} width={400} >
            <VictoryBar alignment="start" barRatio={1} barPadding={0} data={data}/>
          </VictoryChart>
        }
        </div>
      </Card.Body>
    </Card>
  )
}