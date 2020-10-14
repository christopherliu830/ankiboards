import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { getRevlog } from '../util/apicalls';
import { BarChart, Bar, Rectangle, Tooltip } from 'recharts';
import colormap from 'colormap';
import './ByHourGraph.css';
import ReactTooltip from 'react-tooltip';

const hours = [
  '12 AM',
  '1 AM',
  '2 AM',
  '3 AM',
  '4 AM',
  '5 AM',
  '6 AM',
  '7 AM',
  '8 AM',
  '9 AM',
  '10 AM',
  '11 AM',
  '12 PM',
  '1 PM',
  '2 PM',
  '3 PM',
  '4 PM',
  '5 PM',
  '6 PM',
  '7 PM',
  '8 PM',
  '9 PM',
  '10 PM',
  '11 PM',
]
const colors = colormap({
  colormap: 'density',
  nshades: 10,
});

const getColor = num => {
  const offset = 0;
  return num > 0 ? colors[Math.floor( num * (colors.length - offset)) + offset] : colors[offset];
}

export default function(props) {
  const { userId, className, ...other } = props;
  const [data, setData] = useState();

  useEffect(() => {
    getRevlog(userId).then(data => {
      setData(data);
    });
  }, []);

  const CustomBar = props => {
    const {avgEase} = props;
    const fill = getColor(avgEase);
    return <Rectangle {...props} fill={fill}/>
  }

  const renderTooltip = ({active, payload, label}) => {
    if (active) return (
      <div className="bar-tooltip">
        {hours[label]}<br/>
        Reviews: {payload[0].payload.count}<br/>
        Ease Score: {parseInt(payload[0].payload.avgEase * 100)}<br/>
      </div>
    )
  }

  return (
    <Card {...other} className={`bar-graph-card ${className}`}>
      <Card.Header>Reviews By Hour</Card.Header>
      <Card.Body className="d-flex align-items-center justify-content-center">
        <div className="bar-graph">
        {
          data && 
          <>
          <BarChart width={400} height={400} data={data}>
            <Bar dataKey="count" shape={CustomBar}/>
            <Tooltip content={renderTooltip}/>
          </BarChart>
          <ReactTooltip/>
          </>
        }
        </div>
      </Card.Body>
    </Card>
  )
}