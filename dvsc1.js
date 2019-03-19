document.addEventListener('DOMContentLoaded', function(){
  drawChart();
});

function drawChart() {
  d3.csv('https://raw.githubusercontent.com/c-c-l/DVS-Challenge-One/master/data/dvs_challenge_1_membership_time_space.csv').then(function(data) {
    let continentsList = [];
    data.forEach(function(el) {
      continentsList.push(findArea(el.lat, el.long))
    })
    continentsList = _.uniq(continentsList);


    // FUNCTIONS
    function getMinLat(continent) {
      let latList = [];
      data.forEach(function(el){
        if(findArea(el.lat, el.long) === continent) {
          if(el.lat !== ''){
            latList.push(parseFloat(el.lat))
          }
        }
      })
      return _.min(latList);
    }
    function getMaxLat(continent) {
      let latList = [];
      data.forEach(function(el){
        if(findArea(el.lat, el.long) === continent) {
          latList.push(parseFloat(el.lat))
        }
      })
      return _.max(latList);
    }

    // x1, x2, y1, y2 : numbers  coords of the line
    function getMidPoint(x1, x2, y1, y2) {
      let points = [];
      let x = (x2 + x1)/2;
      points.push(x)
      let y = (y2 + y1)/2;
      points.push(y)
      return points;
    }

    function getPath(continent) {
      let id = continent.toLowerCase().replace(' ', '-');
      let pathData = svg.select('#contArc-' + id).attr('d').split(',');
      let midPointOfBase = getMidPoint(parseFloat(pathData[3]), parseFloat(pathData[6]), parseFloat(pathData[1]), parseFloat(pathData[7]));
      svg.append('line').attr('x1', 0).attr('x2', 0).attr('y1', midPointOfBase[0]).attr('y2', midPointOfBase[1])
      let path = {
        d : { x: parseFloat(pathData[0]), y: parseFloat(pathData[1])},
        v : {x: parseFloat(pathData[6]), y: parseFloat(pathData[7])},
        s : {x: parseFloat(pathData[3]), y: parseFloat(pathData[4])},
        m : {x: parseFloat(midPointOfBase[0]), y: parseFloat(midPointOfBase[1])}
      };
      return path;
    }

    function getXScale(continent, value) {
      if(findArea(data.lat, data.long) === continent) {
        let scalesData = getPath(continent);
        if (value === 'data') {
          let xScale = d3.scaleLinear()
            .range([scalesData.s.x , scalesData.s.x])
            .domain([0, 5]);
          return xScale;
        }
        else if (value === 'visualization') {
          let xScale = d3.scaleLinear()
            .range([scalesData.s.x, scalesData.v.x])
            .domain([0, 5])
          return xScale;
        }
        else {
          let xScale = d3.scaleLinear()
            .range([scalesData.s.x, scalesData.m.x])
            .domain([0, 5])
          return xScale;
        }
      }
    }

    function getYScale(continent, value) {
      if(findArea(data.lat, data.long) === continent) {
        let scalesData = getPath(continent);
        if (value === 'data') {
          let yScale = d3.scaleLinear()
            .range([scalesData.s.y , scalesData.d.y])
            .domain([0, 5]);
          return yScale;
        }
        else if (value === 'visualization') {
          let yScale = d3.scaleLinear()
            .range([scalesData.s.y, scalesData.v.y])
            .domain([0, 5])
          return yScale;
        }
        else {
          let yScale = d3.scaleLinear()
            .range([scalesData.s.y, scalesData.m.y])
            .domain([0, 5])
          return yScale;
        }
      }
    }

    function addLines(continent, data) {
      let id = continent.toLowerCase().replace(' ', '-');
        let group = svg.append('g').attr('id', 'group-' + id);
        group.selectAll('polygon')
          .data(data)
          .enter()
          .append('polygon')
          .attr('points', function(d) {
            if(findArea(d.lat, d.long) === continent) {
              let dataX = getXScale(continent, 'data');
              let dataY = getYScale(continent, 'data');
              let vizX = getXScale(continent, 'visualization');
              let vizY = getYScale(continent, 'visualization');
              let socX = getXScale(continent, 'society');
              let socY = getYScale(continent, 'society');
              return dataX(d.data) + ',' + dataY(d.data) + ' ' +
                vizX(parseFloat(d.visualization)) + ',' + vizY(d.visualization) + ' ' +
                socX(parseFloat(d.society)) + ',' + socY(d.society);
              }
          })
          .style('fill', 'none')
          .style('stroke', colors[0])
          .style('stroke-opacity', 0.5);
    }



    // console.log(getMinLat('North America'))

    // CONST LIST
    const continents = continentsList;
    const colors = ['#3c6382', '#079992', '#f6b93b', '#b71540', '#ccc', '#ff6b81', '#ffa502', '#22a6b3']
    const minScore = 0;
    const maxScore = 5;
    console.log(continents)


    // CHART
    const totalWidth = window.innerHeight;
    const margin = {left: 20, top: 20, right: 20, bottom: 20};
    const width =  totalWidth - margin.left - margin.right;
		const height =  totalWidth -  margin.top - margin.bottom;
    const svg = d3.select("#chart").append("svg")
      .attr("width", (width + margin.left + margin.right))
      .attr("height", (height + margin.top + margin.bottom))
			.append("g").attr("class", "wrapper")
			.attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(width/2 + 30);

    const angle = 360/continents.length; // 360 deg / len of benef

    const pie = d3.pie()
      .value(function(d, i) {
        console.log(angle)
        return angle;
      })
      .sort(null);


    // Draw arcs
    svg.selectAll(' .continentsArc')
      .data(pie(continents))
      .enter().append('path')
      .classed('cont-arc', true)
      .attr('id', function(d, i){ console.log(d); return 'contArc-'+ d.data.toLowerCase()})
      .attr('d', arc);

   // Append continent name
   svg.selectAll(".continentName")
       .data(continents)
       .enter().append("text")
       .attr("class", "continent-name")
       .append("textPath")
       .attr("xlink:href",function(d,i){return "#contArc-"+ d.toLowerCase();})
       .text(function(d){return d;});

    // svg.append('polygon').attr('points', '0,0 0,-495 350,-350').style('fill', '#82ccdd').style('fill-opacity', 0.5)
    // svg.append('polygon').attr('points', '0,0 0,-495 175, -422.5').style('fill', '#b71540').style('fill-opacity', 0.5)

    // getPath('other');
    addLines('Other', data);
    addLines('Europe', data);

      // GROUPS BY CONTINENTS
      // continents.map(el => {
      //   if(el !== 'Other') {
      //     svg.append('g').attr('id', 'group-' + el.replace(' ', '-').toLowerCase());
      //   }
      // });

      // DRAW DATA POINTS
      // points('North America');
      // points('Europe');
      // points('South America');
      // points('Asia');
      // points('Africa');
      // points('Oceania');
      // points('Antarctica');
  })
}
// Code from https://github.com/Low-power
function findArea(lat, lng){
  if(lat <= -40){		// Data are from Daniel Pereira
    return "Antarctica";
  }
  if(lat > 12 && lng > -180 && lng < -45){
    const LatNAm = [90,90, 78.13, 57.5, 15, 15, 1.25, 1.25, 51, 60,60];
    return "North America";
    const LonNAm = [-168.75, -10, -10, -37.5, -30, -75, -82.5, -105, -180, -180, -168.75];
  }
  const LatNA2 = [51,51, 60];
  if(lat <= 12 && lat > -40 && lng > -90 && lng < -30){
    const LonNA2 = [166.6, 180, 180];
    return "South America";
  }
  const LatSAm = [1.25, 1.25, 15, 15, -60, -60];
  if(lat < -10 && lng >= 105 && lng <=155){
    const LonSAm = [-105, -82.5, -75, -30, -30, -105];
    return "Oceania";
  }
  const LatEur = [90, 90, 42.5, 42.5, 40.79, 41, 40.55, 40.40, 40.05, 39.17, 35.46, 33, 38, 35.42, 28.25, 15, 57.5,78.13];
  if(lat > 20 && lng >= 60 && lng <=160){
    const LonEur = [-10, 77.5, 48.8, 30, 28.81, 29, 27.31, 26.75, 26.36, 25.19, 27.91, 27.5, 10, -10, -13, -30, -37.5, -10];
    return "Asia";
  }
  const LatAfr = [15, 28.25, 35.42, 38, 33, 31.74, 29.54, 27.78, 11.3, 12.5, -60, -60];
  if(lat > 10 && lat < 40 && lng >= 35 && lng <=60){
    const LonAfr = [-30, -13, -10, 10, 27.5, 34.58, 34.92, 34.46, 44.3, 52,75, -30];
    return "Asia";
  }
  const LatAus = [-11.88, -10.27, -10, -30,-52.5, -31.88];
  if(lat > -40 && lat < 35 && lng >= -20 && lng <=50){
    const LonAus = [110, 140, 145, 161.25, 142.5, 110];
    return "Africa";
 }
 const LatAsi = [90, 42.5, 42.5, 40.79, 41, 40.55, 40.4, 40.05, 39.17, 35.46, 33, 31.74, 29.54, 27.78, 11.3, 12.5, -60, -60, -31.88, -11.88, -10.27, 33.13, 51,60, 90];
 if(lat >= 35 && lng >= -10 && lng <=40){
   const LonAsi = [77.5, 48.8, 30, 28.81, 29, 27.31, 26.75, 26.36, 25.19, 27.91, 27.5, 34.58, 34.92, 34.46, 44.3, 52, 75, 110, 110, 110,140,140, 166.6, 180, 180];
   return "Europe";
   const LatAs2 = [90, 90,60,60];
 }
 const LonAs2 = [-180, -168.75, -168.75, -180];
 return "Other";
 const LatAnt = [-60, -60, -90, -90];
 const LonAnt = [-180, 180, 180, -180];

 let is_in_polygon = function(lat, lng, plats, plngs) {
   let i, j;
   let r = false;
   // assert(plats.length == plngs.length)
   for(i = 0, j = plats.length - 1; i < plats.length; j = i++) {
     if(((plats[i] > lat) != (plats[j] > lat)) &&
     (lng < (plngs[j] - plngs[i]) * (lat - plats[i]) / (plats[j] - plats[i]) + plngs[i])) {
       r = !r;
     }
   }
   return r;
 };
 if(is_in_polygon(lat, lng, LatSAm, LonSAm)) {
   return "South America";
 }
 if(is_in_polygon(lat, lng, LatNAm, LonNAm)) {
   return "North America";
 }
 if(is_in_polygon(lat, lng, LatEur, LonEur)) {
   return "Europe";
 }
 if(is_in_polygon(lat, lng, LatAsi, LonAsi) || is_in_polygon(lat, lng, LatAs2, LonAs2)) {
   return "Asia";
 }
 if(is_in_polygon(lat, lng, LatAus, LonAus)) {
   return "Oceania";
 }
 if(is_in_polygon(lat, lng, LatAfr, LonAfr)) {
   return "Africa";
 }
 if(is_in_polygon(lat, lng, LatAnt, LonAnt)) {
   return "Antarctica";
 }
 return "Other";
}
