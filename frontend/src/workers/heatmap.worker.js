// hello.worker.js

let helloInterval;


self.addEventListener('message', e => { 
  const calendar = {};
  console.log('hi');
  if (e.data) {
    console.log(e.data);
    e.forEach(rev => {
      const date = new Date(rev.id);
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDay();
      if (!calendar[year]) calendar[year] = {};
      if (!calendar[year][month]) calendar[year][month] = 0;
      if (!calendar[year][month][day]) calendar[year][month][day] = 0;
      calendar[year][month][day] += 1;
    })
    console.log('done');
    postMessage({calendar: calendar});
  }
});