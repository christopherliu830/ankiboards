import React, { useState, useRef, useMemo, useEffect } from 'react';
import colormap from 'colormap';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { withLoading } from '../behaviors/with-loading';
import { ArrowLeftCircle, ArrowRightCircle, ArrowDownCircle, ArrowUpCircle } from 'react-feather';
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

const Year = (props) => {
  const { title, months } = props;
  const keys = Object.keys(months);
  const ref = useRef();
  const [ overflown, setOverflown ] = useState(false);

  const handleResize = () => {
    setOverflown(ref.current.scrollWidth - 100 > ref.current.clientWidth); // Maybe change this flat value later
  };

  const handleClick = (e, direction) => {
    ref.current.scrollBy({left: window.innerWidth * 1/2 * direction, behavior: 'smooth'});
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  return (
    <div className="m-3">
      <h3>{title}</h3>
      <div className="d-flex">
        { overflown && <Button variant="circle" onClick={e => handleClick(e, -1)}>
          <ArrowLeftCircle/>
        </Button>}
        <div className="d-flex overflow-hidden" ref={ref}>
          {keys.map(key => {
            return <Month key={key} days={months[key]} title={numToMonth[key]}/>
          })}
        </div>
        { overflown && <Button variant="circle" onClick={e => handleClick(e, 1)}>
          <ArrowRightCircle/>
        </Button>}
      </div>
    </div>
  )
}

const Month = (props) => {
  const { title, days } = props;
  const keys = Object.keys(days)

  const padding = [];
  if (keys.length > 0) {
    const daysToPad = new Date(days[keys[0]].unixTime * 1000).getDay();
    for (let i = 0; i < daysToPad; i++) {
      padding.push(<div key={-i} className="heatmap-square"/>);
    }
  };

  return (
    <div className="m-1">
      <h5>{title}</h5>
      <div className="month">
        {padding}
        {keys.map(key => {
          return <OverlayTrigger
            key={key}
            overlay={
              <Tooltip className="loadedTest">
                {new Date(days[key].unixTime * 1000).toDateString()} : {`${days[key].count} reviews`}
              </Tooltip>
            }
          >
            <div key={key} className="heatmap-square" style={{background: getColorIndex(days[key].count)}}/>
          </OverlayTrigger>
        })}
      </div>
    </div>
  )
}

export default function Calendar(props) {
  const { calendar } = props;
  const ref = useRef();
  const innerRef = useRef();
  const years = Object.keys(calendar);
  const [ expanded, setExpanded ] = useState(false);

  useEffect(() => {
    ref.current.style.maxHeight = `${innerRef.current.scrollHeight/years.length}px`;
  }, []);

  const handleClick = e => {
    if (expanded) {
      ref.current.style.maxHeight = `${innerRef.current.scrollHeight/years.length}px`;
    }
    else {
      ref.current.style.maxHeight = `${innerRef.current.scrollHeight}px`;
    }
    setExpanded(!expanded);
  };

  return (
    <Card className="shadow rounded m-3 bg-light">
      <Card.Header>Heatmap</Card.Header>
      <Card.Body className="d-flex flex-column heatmap-card-body">
        <div className="card-outer" ref={ref}>
          <div className="card-inner-inner" ref={innerRef}>
            { years.map(key => (<Year key={key} title={key} months={calendar[key]}/>)) }
          </div>
        </div>
        <Button variant="circle" onClick={handleClick}>
          { expanded ? <ArrowUpCircle/> : <ArrowDownCircle/>}
        </Button>
      </Card.Body>
    </Card>
  )
}



// const Heatmap = React.forwardRef((props, ref) => {
//   const { items, ...otherProps} = props;

//   let max = 0;
//   const days = items.map(item => {
//     if (item.count > max) max = item.count;
//     return { date: new Date(item.unixTime * 1000), count: item.count };
//   });

//   while (days[0].date.getDay() !== 0) {
//     const yesterday = new Date(days[0].date);
//     yesterday.setDate(days[0].date.getDate() - 1);
//     days.unshift({date: yesterday, count: 0});
//   }

//   const getColorIndex = (num, max) => {
//     const offset = 6;
//     if (num === max) num--; // So that we don't get colors[colors.length]
//     return num > 0 ? props.colorscheme[Math.floor(num/max * (props.colorscheme.length - offset)) + offset] : "light";
//   }

//   const squares = useMemo(() => days.map(day => {
//     const color = getColorIndex(day.count, max);
//     return (
//       <OverlayTrigger
//         key={day.date.getTime()}
//         overlay={
//           <Tooltip className="loadedTest">
//             {day.date.toDateString()} : {`${day.count} reviews`}
//           </Tooltip>
//         }
//       >
//         <div key={day.date.getTime()} className="heatmap-square" style={color && {background: color}}/>
//       </OverlayTrigger>
//     )
//   }), days);

//   return (
//     <div className="parent">
//       <div className="heatmap-inner" ref={ref}>
//         {squares}
//       </div>
//     </div>
//   )
// });

// export function Ass(props) {
//   const {items} = props;
//   const ref = useRef(0);
//   const aRef = useRef(0);
//   const [ currentColor, setColor ] = useState();

//   const colors = useMemo(() => {
//     console.log(currentColor);
//     return colormap({ colormap : currentColor}).reverse();
//   }, [currentColor]);

//   const getColorIndex = (num, max) => {
//     const offset = 6;
//     if (num === max) num--; // So that we don't get colors[colors.length]
//     return num > 0 ? colors[Math.floor(num/max * (colors.length - offset)) + offset] : "light";
//   }

//   const handleClick = (e, direction) => {
//     ref.current.scrollBy({left: window.innerWidth * 1/5 * direction, behavior: 'smooth'});
//   };

//   useEffect(() => {
//     console.log('render', ref.current);
//     ref.current && ref.current.scrollBy({left: 9999, behavior: 'smooth'});
//   })

//   const LoadedBody = withLoading(items, {spinnerProps: {style: {width: '50px', height: '50px'}}})(Card.Body);
//   return ( 
//     <>
//     <Form>
//       <Form.Group>
//         <Form.Label>Select</Form.Label>
//         <Form.Control as="select" onChange={e => setColor(e.target.value)}>
//           { ['jet', 'hsv', 'hot', 'spring', 'summer', 'autumn', 'winter', 'bone', 'copper', 'greys', 'yignbu', 'greens',
//              'yiorrd', 'bluered', 'rdbu', 'picnic', 'rainbow', 'portland', 'blackbody', 'earth', 'electric', 'alpha', 'viridis', 
//               'inferno', 'magma', 'plasma', 'warm', 'cool', 'rainbow-soft', 'bathymetry', 'cdom', 'chlorophyll', 'density', 'freesurface-blue', 
//               'freesurface-red', 'oxygen', 'par', 'phase', 'salinity', 'temperature', 'turbidity', 'velocity-blue', 'velocity-green', 
//               'cubehelix' ].map(color => <option key={color}>{color}</option>)

//           }
//         </Form.Control>
//       </Form.Group>
//     </Form>
//     <Card className="shadow rounded m-3 bg-light">
//       <Card.Header>Heatmap</Card.Header>
//       <LoadedBody className="d-flex heatmap-card-body">
//         <Button ref={aRef} variant="circle" onClick={e => handleClick(e, -1)}>
//           <ArrowLeftCircle className=""/>
//         </Button>
//         <Heatmap ref={ref} colorscheme={colors} {...props}/>
//         <Button variant="circle" onClick={e => handleClick(e, 1)}>
//           <ArrowRightCircle/>
//         </Button>
//       </LoadedBody>
//     </Card>
//     </>
//   );
// }
