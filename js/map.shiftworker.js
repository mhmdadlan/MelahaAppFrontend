// initilize & style the map
var mapJubailVessels = new GMaps({
    el: '#map',
    zoom: 14,
    lat: 27.08,
    lng: 49.68,
    mapTypeId: 'satellite',
    disableDefaultUI: true,
    zoomControl: true,
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: google.maps.ControlPosition.TOP_LEFT
    }

});
$(function () {

    'use strict';
    // public variables
    var zoomLevel = 2;
    var markerCluster
    var markers = [];
    var nightModeStyle = [
        {
            "featureType": "all",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                },
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 13
                },
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#144b53"
                },
                {
                    "lightness": 14
                },
                {
                    "weight": 1.4
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#08304b"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#0c4152"
                },
                {
                    "lightness": 5
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#0b434f"
                },
                {
                    "lightness": 25
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#0b3d51"
                },
                {
                    "lightness": 16
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#146474"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#021019"
                }
            ]
        }
    ];
    var shipSVG = "M445.6,52.9c-29.9,50.8-62.3,52.9-62.3,52.9H37.5C21.8,106.1,0,83.6,0,83.6V52.9V22.2C0,22.2,21.8-0.3,37.5,0h345.8C383.3,0,415.7,2.1,445.6,52.9z M80.4,18.8v34.1V87h58.4V52.9V18.8H80.4z";
    var icons = {
        Tanker: {
            id: "8",
            name: "منتجات بتروكيماوية",
            path: shipSVG,
            anchor: new google.maps.Point(350, 50),
            scale: .1,
            fillColor: "#35B4FF",
            fillOpacity: 1,
            strokeColor: "#000",
            strokeWeight: .5
        },
        Cargo: {
            id: "7",
            name: "بضائع صب",
            path: shipSVG,
            anchor: new google.maps.Point(350, 50),
            scale: .1,
            fillColor: "#D70B53",
            fillOpacity: 1,
            strokeColor: "#000",
            strokeWeight: .5
        },
        Oil: {
            name: "منتجات بترولية مكررة",
            path: shipSVG,
            anchor: new google.maps.Point(350, 50),
            scale: .1,
            fillColor: "#1CAF9A",
            fillOpacity: 1,
            strokeColor: "#000",
            strokeWeight: .5
        },
        Other: {
            name: "اخرى",
            path: shipSVG,
            anchor: new google.maps.Point(350, 50),
            scale: .1,
            fillColor: "#384446",
            fillOpacity: 1,
            strokeColor: "#000",
            strokeWeight: .5
        },
        default: {
            name: "اخرى",
            path: "M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0",
            anchor: new google.maps.Point(0, 0),
            scale: .1,
            fillColor: "#384446",
            fillOpacity: .2,
            strokeColor: "#FFF",
            strokeWeight: 1
        }

    }
    var legendList = document.getElementById('legendList');
    for (var key in icons) {
        if (key == "default")
            continue;
        var type = icons[key];
        var name = type.name;
        var color = type.fillColor;
        var strokeColor = type.strokeColor;
        var li = document.createElement('li');
        li.innerHTML = '<svg version="1.1"' +
            'class="fa-li"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"' +
            'xml:space="preserve" viewBox="0 0 445.6 105.8" fill="' + color + '">' +
            '<path d="' + type.path + '"/>' +
            '</svg>' + name;
        $(li).addClass("fa-2x text-right")
        legendList.appendChild(li);
    }


    mapJubailVessels.addStyle({
        styledMapName: 'Default Jubail Map',
        styles: [
            { stylers: [{ visibility: 'simplified' }] },
            { elementType: 'labels', stylers: [{ visibility: 'off' }] }
        ],
        mapTypeId: 'default'
    });
    mapJubailVessels.addStyle({
        styledMapName: 'Night Mode Jubail Map',
        styles: nightModeStyle,
        mapTypeId: 'night_mode_jubail_map'
    });

    // Add map key element to the map
    var legend = document.getElementById('legend');
    mapJubailVessels.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);
    var filter = document.getElementById('mapFilter');
    mapJubailVessels.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(filter);
    // Add markers to the map
    $.ajax({
        type: 'GET',
        url: '/vessels.json',
        dataType: 'json',
        success: function (data) {
            $.each(data, function (index, vessel) {
                addVesselToMap(markers, index, vessel, mapJubailVessels, icons);
                if (vessel.CURRENT_PORT != "AL JUBAIL" && vessel.CURRENT_PORT != "AL JUBAIL ANCH") {
                    markers[index].setVisible(false);
                }
            });
        },
        complete: function () {
            var options = {
                imagePath: '../img/ClusterImages/m',
                ignoreHiddenMarkers: true
            };
        }
    });
    $("#port").change(function () {
        if ($('#port').is(':checked')) {
            $.each(markers, function (index, marker) {
                if (marker.CURRENT_PORT == "AL JUBAIL") {
                    markers[index].setVisible(true);
                }
            });
        } else {
            $.each(markers, function (index, marker) {
                if (marker.CURRENT_PORT == "AL JUBAIL") {
                    markers[index].setVisible(false);
                }
            });
        }
        if (markerCluster != null)
            markerCluster.repaint();
    });
    $("#anchorage").change(function () {
        if ($('#anchorage').is(':checked')) {
            $.each(markers, function (index, marker) {
                if (marker.CURRENT_PORT == "AL JUBAIL ANCH") {
                    markers[index].setVisible(true);
                }
            });
        } else {
            $.each(markers, function (index, marker) {
                if (marker.CURRENT_PORT == "AL JUBAIL ANCH") {
                    markers[index].setVisible(false);
                }
            });
        }
        if (markerCluster != null)
            markerCluster.repaint();
    });
    $("#expected_voyages").change(function () {
        if ($('#expected_voyages').is(':checked')) {
            $.each(markers, function (index, marker) {
                if (!marker.CURRENT_PORT.startsWith("AL JUBAIL")) {
                    markers[index].setVisible(true);
                }
            });
        } else {
            $.each(markers, function (index, marker) {
                if (!marker.CURRENT_PORT.startsWith("AL JUBAIL")) {
                    markers[index].setVisible(false);
                }
            });
        }
        if (markerCluster != null)
            markerCluster.repaint();
    });

    $('.filterForm').css({ display: "none" });
    $('#filterTitle').click(animateFilterTitle);
    // Toggles
    $('#nightMode').on('click', function (e) {
        e.preventDefault();
        $(this).toggleClass('on');
        if ($(this).hasClass('on')) {
            mapJubailVessels.setStyle('night_mode_jubail_map');
        } else {
            mapJubailVessels.setStyle('satellite');

        }

    });

    google.maps.event.addListener(mapJubailVessels.map, 'zoom_changed', function () {
        var i, prevZoomLevel, currentZoom;

        prevZoomLevel = zoomLevel;
        currentZoom = mapJubailVessels.map.getZoom();
        currentZoom > 15 ? zoomLevel = 1 : zoomLevel = 2;
        if (currentZoom >= 1) {
            var updatedScale = .015;

        }
        if (currentZoom >= 4) {
            var updatedScale = .02;

        }
        if (currentZoom >= 5 ) {
            var updatedScale = .025;

        } if (currentZoom >= 6) {
            var updatedScale = .03;

        }
        if (currentZoom >= 7) {
            var updatedScale = .035;

        }

        if (currentZoom >= 8) {
            var updatedScale = .04;

        }
        if (currentZoom >= 9) {
            var updatedScale = .05;

        }
        if (currentZoom >= 10) {
            var updatedScale = .06;

        }
        if (currentZoom >= 11) {
            var updatedScale = .07;

        }
        if (currentZoom >= 12) {
            var updatedScale = .08;

        }
        if (currentZoom >= 13) {
            var updatedScale = .09;

        }
        if (currentZoom >= 14) {
            var updatedScaleBoat = .10;

        }
        if (currentZoom >= 15) {
            var updatedScale = .11;
            var updatedScaleBoat = .11;

        }
        if (currentZoom >= 16) {
            var updatedScale = .15;
            var updatedScaleBoat = .15;

        }
        if (currentZoom >= 17) {
            var updatedScale = .2;
            var updatedScaleBoat = .2;
        }
        if (currentZoom >= 18) {
            var updatedScale = .3;
            var updatedScaleBoat = .3;
        }
        if (currentZoom >= 19) {
            var updatedScale = .6;
            var updatedScaleBoat = .6;
        }
        if (currentZoom >= 20) {
            var updatedScale = 1.2;
            var updatedScaleBoat = 1.2;
        }

        for (i = 0; i < markers.length; i++) {
            if (zoomLevel === 2) {
                markers[i].defaultIcon.scale = updatedScale;
                markers[i].setIcon(markers[i].defaultIcon);
            }
            else {
                markers[i].mainIcon.scale = updatedScaleBoat;
                markers[i].setIcon(markers[i].mainIcon);
            }


        }
    });

});


function addVesselToMap(markers, index, element, mapJubailVessels, icons) {
    createMarker(markers, index, element, mapJubailVessels.map, icons);
    var infoWindow = createInfoWindow(markers, index);
    markers[index].addListener('click', function () {
        infoWindow.open();
    });
}

function createMarker(markers, i, element, map, icons) {
    var icon = icons.Other;
    if (element.SHIPTYPE.startsWith("8")) {
        icon = icons.Tanker;
    }
    if (element.SHIPTYPE.startsWith("7")) {
        icon = icons.Cargo;
    }
    if (element.TYPE_NAME == "Oil Tanker") {
        icon = icons.Oil;
    }
    icon.rotation = parseInt(element.COURSE) + 270;
    var defaultIcon = Object.assign({}, icon);
    defaultIcon.path = "M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0",
        defaultIcon.fillOpacity = .8;
    defaultIcon.strokeWeight = .5;
    defaultIcon.strokeColor = "#000";
    defaultIcon.scale = .1;
    defaultIcon.anchor = new google.maps.Point(0, 0);

    markers[i] = new google.maps.Marker({
        position: new google.maps.LatLng(element.LAT, element.LON),
        IMO: element.IMO,
        map: map,
        FLAG: element.FLAG,
        SHIPNAME: element.SHIPNAME,
        DRAUGHT: element.DRAUGHT,
        CURRENT_PORT: element.CURRENT_PORT,
        TYPE_NAME: element.TYPE_NAME,
        ETA: element.ETA,
        iconBaseUrl: "/img/mapicons/",
        icon: defaultIcon,
        defaultIcon: defaultIcon,
        mainIcon: Object.assign({}, icon)
    });
}

function createInfoWindow(markers, i) {
    return new SnazzyInfoWindow({
        marker: markers[i],
        position: 'top',
        offset: {
            top: '-15px',
            right: '0'
        },
        wrapperClass: 'custom-window',
        content: "<div class='container  text-center' dir='rtl' >" +
            "<div class='row grid-divider'>" +
            "<div class='col-md-4' style='border-left:1px solid #999;'>" +
            "<span style='display:block'>IMO</span><br />" + "<b>" + markers[i].IMO + "</b>" +
            "</div>" +
            "<div  class='col-md-4' style='border-left:1px solid #999;'>" +
            "<span style='display:block'>إسم الفينة</span><br />" + "<b>" + markers[i].SHIPNAME + "</b>" +
            "</div>" +
            "<div  class='col-md-4'>" +
            "<span style='display:block'>العلم</span><br />" + "<b>" + markers[i].FLAG + "</b>" +
            "</div>" +
            "</div>" +
            "<hr style='border-color:#999' />" +
            "<div class='row grid-divider mg-t-4'>" +
            "<div class='col-md-4' style='border-left:1px solid #999;'>" +
            "<span style='display:block'>الميناء الحالي</span><br />" + "<b>" + markers[i].CURRENT_PORT + "</b>" +
            "</div>" +
            "<div  class='col-md-4' style='border-left:1px solid #999;'>" +
            "<span style='display:block'>عمق الغاطس</span><br />" + "<b>" + markers[i].DRAUGHT + "</b>" +
            "</div>" +
            "<div  class='col-md-4'>" +
            "<span style='display:block'>نوع السفينة</span><br />" + "<b>" + markers[i].TYPE_NAME + "</b>" +
            "</div>" +
            "</div>" +
            "<div class='row mt-1'>" +
            "<a href='/voyage_details.html' target='_blank' class='btn btn-info btn-block'>عرض</a>" +
            "</div>" +
            "</div>",
        showCloseButton: true,
        closeOnMapClick: true,
        padding: '10px',
        maxWidth: '600px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        shadow: false,
        fontColor: '#fff',
        fontSize: '15px'
    });
}

function animateFilterTitle() {
    if ($('#filterTitle').css('borderRadius') == "50%") {
        $('#filterTitle').animate({
            borderRadius: "2",
            width: "300px"
        }, "fast", function () {
            $('.filterForm').slideToggle();
            $('#filterTitle h5').fadeIn();
            $('#filterTitle h5').toggleClass('left');

        });
        $('#filterTitle span.fa').toggleClass('left')
    } else if ($('#filterTitle').css('borderRadius') == "2px") {
        $('.filterForm').slideToggle(function () {
            $('#filterTitle').animate({
                borderRadius: "50%",
                width: "50px"
            }, 'fast');
            $('#filterTitle span.fa').toggleClass('left');

        });
        $('#filterTitle h5').fadeOut();

    }
}