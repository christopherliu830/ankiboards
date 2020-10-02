import React, { useState, useRef, useEffect } from 'react';
import colormap from 'colormap';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { ArrowDownCircle, ArrowUpCircle } from 'react-feather';
import { getHeatmap } from '../util/apicalls';
import { withLoading } from '../behaviors/with-loading';
import './Heatmap.css';

const colors = colormap({
  colormap: 'yignbu',
}).reverse();
const getColorIndex = (num, max) => {
  const offset = 10;
  max = 500;
  if (num === max) num--; // So that we don't get colors[colors.length]
  return num > 0 ? colors[Math.floor(num/max * (colors.length - offset)) + offset] : colors[offset];
}
const numToMonth = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
}
const Year = React.memo((props) => {
  const { year, months } = props;
  const keys = Object.keys(months);
  const ref = useRef();

  return (
    <div className="m-3">
      <h3>{year}</h3>
      <div className="d-flex">
        <div className="d-flex year-chart" ref={ref}>
          {keys.map(month => {
            return <Month key={month} year={year} month={month} days={months[month]}/>
          })}
        </div>
      </div>
    </div>
  )
}, (a, b) => true)

const Month = React.memo((props) => {
  const { year, month, days } = props;
  const keys = Object.keys(days)

  const padding = [];
  if (keys.length > 0) {
    const daysToPad = new Date(year, month, keys[0]).getDay();
    for (let i = 0; i < daysToPad; i++) {
      padding.push(<div key={-i} className="heatmap-square"/>);
    }
  };

  return (
    <div className="m-1">
      <h5>{numToMonth[month]}</h5>
      <div className="month">
        {padding}
        {keys.map(day => {
          // return <div 
          //   data-content="Popup" 
          //   data-toggle="popover"
          //   rel="popover"
          //   data-trigger="hover"
          //   key={day} 
          //   className="heatmap-square" 
          //   style={{background: getColorIndex(days[day])}}
          // />
          return <OverlayTrigger
            key={day}
            overlay={
              <Tooltip className="loadedTest">
                {new Date(year, month, day).toDateString()} : {`${days[day]} reviews`}
              </Tooltip>
            }
          >
            <div key={day} className="heatmap-square" style={{background: getColorIndex(days[day])}}/>
          </OverlayTrigger>
        })}
      </div>
    </div>
  )
})

const InnerHeatmap = React.memo(React.forwardRef((props, ref) => {
  const { calendar } = props;
  const years = Object.keys(calendar);
  return (
    <div className="card-inner-inner" ref={ref}>
      {years && years.map(key => (<Year key={key} year={key} months={calendar[key]}/>))}
    </div>
  )
}));

export default function (props) {
  const ref = useRef();
  const innerRef = useRef();
  const [ expanded, setExpanded ] = useState(false);
  const [ calendar, setCalendar ] = useState(null);
  const len = calendar && Object.keys(calendar).length;

  useEffect(() => {
    getHeatmap(props.userId).then(data => {
      setCalendar(data);
    });
  }, [props.userId])

  useEffect(() => {
    if (calendar) {
      ref.current.style.maxHeight = `${innerRef.current.scrollHeight/len}px`;
    }
  }, [calendar, len])

  const handleClick = e => {
    if (expanded) {
      ref.current.style.maxHeight = `${innerRef.current.scrollHeight/len}px`;
    }
    else {
      ref.current.style.maxHeight = `${innerRef.current.scrollHeight}px`;
    }
    setExpanded(!expanded);
  };

  const LoadingBody = withLoading(!!calendar)(InnerHeatmap);

  return (
    <Card {...props} >
      <Card.Header>Heatmap</Card.Header>
      <Card.Body className="d-flex flex-column heatmap-card-body">
        <div className="card-outer" ref={ref}>
          {calendar && <LoadingBody calendar={calendar} ref={innerRef}/> }
        </div>
        <Button variant="circle" onClick={handleClick}>
          {expanded? <ArrowUpCircle/> : <ArrowDownCircle/> }
        </Button>
      </Card.Body>
    </Card>
  )
}