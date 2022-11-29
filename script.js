const mymap = L.map(
  'map',
  { center: [49.1744092, 16.5795631],
    zoom: 14,},
);

const mapyCz = L.tileLayer(
  'http://m{s}.mapserver.mapy.cz/turist-m/{z}-{x}-{y}',
   {maxZoom: 19,
    minZoom: 5,
    attribution: '© <a href="//www.seznam.cz" target="_blank">Seznam.cz, a.s.</a>',
    subdomains: ['1', '2', '3', '4'],
  },).addTo(mymap);

const leaflet = L.tileLayer(
  'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
  { maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors,',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,},
);

const google = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  maxZoom: 21,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors,',
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
});

const baseLayers = {
  'Turistická': mapyCz,
  'Základní': leaflet,
  'Letecká': google,}

var lcontrol = L.control.locate().addTo(mymap);  /* ikona polohy */

var layerIcon1 = L.control.layers(baseLayers).addTo(mymap);

var id = 0;

	for (var i=0; i < list.length; i++) {
    id = id + 1;
		L.circle(list[i].coords, {
			color: 'red',
			fillColor: '#f03',
			fillOpacity: 0.3,
			radius: 161,
            weight: 1
		}).addTo(mymap)
    /*.bindPopup(list[i].nazev)*/
    .bindPopup(list[i].nazev + " <br> " + list[i].GC)
    .on("mouseout", mouseOver)
    .on("click", onClick);

		L.circle(list[i].coords, {
			color: 'red',
			fillColor: '#f03',
			fillOpacity: 0.5,
			radius: 1
		}).addTo(mymap); }

function add(a,b,c,d) {
  document.getElementById('a').value = "";
  document.getElementById('b').value = "";
  document.getElementById('c').value = "";
  document.getElementById('d').value = "";

  var addedListOfCoord = [c,d]
    
  var kruh = L.circle(addedListOfCoord, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.3,
    radius: 161,
    weight: 1
    }).addTo(mymap)
    .bindPopup(a + " <br> " + b)
    .on("click", onClick)
    .on("mouseout", mouseOver)
    .on("contextmenu", otherClick);

    /* bodík uprostřed kružnice*/
    var malyKruh = L.circle(addedListOfCoord, {
			color: 'red',
			fillColor: '#f03',
			fillOpacity: 0.5,
			radius: 1
		}).addTo(mymap);
    mymap.setView(addedListOfCoord, 15);
        
    L.featureGroup([kruh, malyKruh]).addTo(mymap)
    .on("contextmenu",otherClick);    
 }
   /* maže pravým stiskem tlačítka kroužek a nuluje formulář*/
function otherClick(e) {
  e.target.remove();
  document.getElementById("nazev_kese_zde").innerHTML = "";
  document.getElementById("souradnice_zde").innerHTML = "";
  document.getElementById("gc_kod_zde").innerHTML = "";}
   
   /* při odjetí z kruhu, se vrátí červená barva kruhu */
   function mouseOver(e) {
  e.target.setStyle({color: 'red', fillColor: '#f03'});
}  

function onClick(e) {
  e.target.setStyle({color: "green", fillColor: '#66cf3a'});
  var popup = e.target.getPopup();
  var obsah_bubliny = popup.getContent();
  var rozdelObsahBubliny = obsah_bubliny.split(" <br> ");

  var sourad = e.target.getLatLng();
  var souradA = Object.values(sourad);
  var souradStr = JSON.stringify(souradA); //ziska string hodnot
  var souradStr = souradStr.slice(1,-1);
  
 var vycucSouradnic = souradStr.split(",");
  
  //prevod decimal na dd° mm.mmm
   var Ndd = parseInt(vycucSouradnic[0]);
   var Edd = parseInt(vycucSouradnic[1]);

   var Nzbytek = parseFloat(vycucSouradnic[0]) - (Ndd * 1.0);
   var Ezbytek = parseFloat(vycucSouradnic[1]) - (Edd * 1.0);

   var Nmm = Nzbytek * 60.0;
   var Emm = Ezbytek * 60.0;

   Nmm = Math.round (Nmm * 1000.0) / 1000.0;
   var Nmm3desmista = Nmm.toFixed(3);
   Emm = Math.round (Emm * 1000.0) / 1000.0;
   var Emm3desmista = Emm.toFixed(3);

   var Nsouradky = "N " + Ndd + "° " + Nmm3desmista;
   var Esouradky = "E " + Edd + "° " + Emm3desmista;

  var www = "https://coord.info/"  + rozdelObsahBubliny[1];
  
  const gc_kod_zde = document.createElement('a');
   
  document.getElementById("nazev_kese_zde").innerHTML = rozdelObsahBubliny[0];
  document.getElementById("souradnice_zde").innerHTML = souradStr;
  document.getElementById("gc_kod_zde").innerHTML = rozdelObsahBubliny[1];
  document.getElementById("gc_kod_zde").setAttribute("href",www);
  document.getElementById("souradniceDDMMmm").innerHTML = Nsouradky + ", " + Esouradky;
}