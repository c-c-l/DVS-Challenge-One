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
    console.log(data)
    function getMinLat(continent) {
      let latList = [];
      data.forEach(function(el){
        if(findArea(el.lat, el.long) === continent) {
          latList.push(el.lat)
        }
      })
      return _.min(latList);
    }
    function getMaxLat(continent) {
      let latList = [];
      data.forEach(function(el){
        if(findArea(el.lat, el.long) === continent) {
          latList.push(el.lat)
        }
      })
      return _.max(latList);
    }

    // CONST LIST
    const continents = continentsList;
    const colors = ['#079992', '#f6b93b', '#e55039', '#ccc']
    const minScore = 0;
    const maxScore = 5;
    const minLatNAm = getMinLat('North America');
    const maxLatNAm = getMaxLat('North America');
    const minLatEU = getMinLat('Europe');
    const maxLatEU = getMaxLat('Europe');
    const minLatSAm = getMinLat('South America');
    const maxLatSAm = getMaxLat('South America');
    const minLatAs = getMinLat('Asia');
    const maxLatAs = getMaxLat('Asia');
    const minLatOce = getMinLat('Oceania');
    const maxLatOce = getMaxLat('Oceania');
    const minLatAfr = getMinLat('Africa');
    const maxLatAfr = getMaxLat('Africa');
    const minLatAnt = getMinLat('Antarctica');
    const maxLatAnt = getMaxLat('Antarctica');

    console.log(continents)

    console.log(getMinLat('Europe'))
    console.log(getMaxLat('Europe'))

    // CHART
    const width = window.innerWidth * .9;
    const height = window.innerHeight;
    let svg = d3.select('#chart').append('svg')
      .attr('width', width)
      .attr('height', height);

    // SCALES
    const xScaleNAm = d3.scaleLinear()
      .range([0, (width - 60)/continents.length]) // padding 40 + offset 20
      .domain([minLatNAm, maxLatNAm]);

    const xScaleEU = d3.scaleLinear()
      .range([(width - 60)/continents.length, ((width - 60)/continents.length)*2]) // padding 40 + offset 20
      .domain([minLatEU, maxLatEU]);

    const xScaleSAm = d3.scaleLinear()
      .range([((width - 60)/continents.length)*2, ((width - 60)/continents.length)*3]) // padding 40 + offset 20
      .domain([minLatSAm, maxLatSAm]);

    const xScaleAs = d3.scaleLinear()
      .range([((width - 60)/continents.length)*3, ((width - 60)/continents.length)*4]) // padding 40 + offset 20
      .domain([minLatAs, maxLatAs]);

    const xScaleOce = d3.scaleLinear()
      .range([((width - 60)/continents.length)*4, ((width - 60)/continents.length)*5]) // padding 40 + offset 20
      .domain([minLatOce, maxLatOce]);

    const xScaleAfr = d3.scaleLinear()
      .range([((width - 60)/continents.length)*5, ((width - 60)/continents.length)*6]) // padding 40 + offset 20
      .domain([minLatAfr, maxLatAfr]);

    const xScaleAnt = d3.scaleLinear()
      .range([((width - 60)/continents.length)*6, ((width - 60)/continents.length)*7]) // padding 40 + offset 20
      .domain([minLatAnt, maxLatAnt]);

    const yScale = d3.scaleLinear()
      .range([0, height - 60]) // padding 40 + offset 20
      .domain([minScore, maxScore]);

      // GROUPS BY CONTINENTS
      continents.map(el => {
        if(el !== 'Other') {
          svg.append('g').attr('id', 'group-' + el.replace(' ', '-').toLowerCase());
        }
      });

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
