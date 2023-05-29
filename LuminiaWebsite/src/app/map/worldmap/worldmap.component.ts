import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav} from '@angular/material/sidenav';
import * as L from 'leaflet';
import 'leaflet-easybutton';
import { TownsLayer } from '../maplayers/locationLayers/towns.maplayer';
import { IAmMapLayer } from '../maplayers/maplayer.interface';
import { AltarsLayer } from '../maplayers/altars.maplayer';
import { MirnaLayer } from '../maplayers/altarLayers/mirna.maplayer';
import { VexLayer } from '../maplayers/altarLayers/vex.maplayer';
import { FenlaLayer } from '../maplayers/altarLayers/fenla.maplayer';
import { LocationsLayer } from '../maplayers/locations.maplayers';
import { RegionsLayer } from '../maplayers/locationLayers/regions.maplayer';
import { AmataLayer } from '../maplayers/altarLayers/amata.maplayer';
import { AtamaLayer } from '../maplayers/altarLayers/atama.maplayer';
import { CaraLayer } from '../maplayers/altarLayers/cara.maplayer';
import { KazLayer } from '../maplayers/altarLayers/kaz.maplayer';
import { KrigonLayer } from '../maplayers/altarLayers/krigon.maplayer';
import { LokaineLayer } from '../maplayers/altarLayers/lokaine.maplayer';
import { TaoidesLayer } from '../maplayers/altarLayers/taoides.maplayer';
import { VaknorLayer } from '../maplayers/altarLayers/vaknor.maplayer';
import { YuvicLayer } from '../maplayers/altarLayers/yuvic.maplayer';
import { LuminiaApiService } from 'src/app/services/luminia-api/luminia-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorSnackbarComponent } from 'src/app/snackbars/error-snackbar/error-snackbar.component';


@Component({
  selector: 'app-worldmap',
  templateUrl: './worldmap.component.html',
  styleUrls: ['./worldmap.component.css']
})

export class WorldmapComponent implements AfterViewInit, OnInit{

  public layerStates = new Map<IAmMapLayer,boolean>();
  private map : any;

  public allLayers? : IAmMapLayer[] = [];

  private dragMarker : any;

  @ViewChild('sidePanel') sidenav: MatSidenav | null = null;

  constructor(private luminiaApiService: LuminiaApiService, private snackBar: MatSnackBar) {
   }

  async ngAfterViewInit(): Promise<void> {
    this.initMap();
    await this.defineLayers();
  }

  ngOnInit(): void {
  }

  private async defineLayers(): Promise<void> {

    //LocationLayers
    let locationLayers: IAmMapLayer[] = [
      new RegionsLayer(this.map, this.luminiaApiService),
      new TownsLayer(this.map, this.luminiaApiService)
    ];
    this.allLayers?.push(new LocationsLayer(this.map, this.luminiaApiService, locationLayers));

    try {
      //AltarLayers
      let altarLayers: IAmMapLayer[] = [
        new AmataLayer(this.map, this.luminiaApiService),
        new AtamaLayer(this.map, this.luminiaApiService),
        new CaraLayer(this.map, this.luminiaApiService),
        new FenlaLayer(this.map, this.luminiaApiService),
        new KazLayer(this.map, this.luminiaApiService),
        new KrigonLayer(this.map, this.luminiaApiService),
        new LokaineLayer(this.map, this.luminiaApiService),
        new MirnaLayer(this.map, this.luminiaApiService),
        new TaoidesLayer(this.map, this.luminiaApiService),
        new VaknorLayer(this.map, this.luminiaApiService),
        new VexLayer(this.map, this.luminiaApiService),
        new YuvicLayer(this.map, this.luminiaApiService),
      ];

      for (const layer of altarLayers) {
        await layer.getMarkers();
      }

      this.allLayers?.push(new AltarsLayer(this.map, this.luminiaApiService, altarLayers));
    } catch {
      this.snackBar.openFromComponent(ErrorSnackbarComponent, {
        panelClass: 'error-snackbar',
        data: "Altar markers could not be loaded.",
        duration: 10000
      });
    }
  }

  private initMap(): void{

    /*
    this.map = L.map('map', {crs: L.CRS.Simple}).setView([3.56,1.30]).setZoom(2).setMaxZoom(8).setMinZoom(2);
    var bounds = L.latLngBounds([-50,-50], [50, 50]);
    var image = L.imageOverlay('assets/rsworldmap.png', bounds).addTo(this.map).setBounds([0,0], [50,50]);
    */

    //Create the map
    this.map = L.map('map', {attributionControl: false}).setView([17.957832, 7.097168],6);

    //Create the tile layer

    L.tileLayer('assets/map/{z}/{x}/{y}.png', {
      noWrap: true,
      minZoom: 0,
      maxZoom: 8,
      maxNativeZoom:6,
    }).addTo(this.map);

    /*
    //Sidepanel toggle button
    var customControl = L.Control.extend({
      options: {
        position: 'topright'
      },
      onAdd: function()
      {
        var button = L.DomUtil.create('input');
        button.id = "toggleSidePanelButton";
        button.type = "button";
        button.value = "Toggle Sidepanel";
        button.className = "worldmap-sidepanel-button leaflet-bar";

        return button;
      }
    })

    this.map.addControl(new customControl);
    var sidePanelButton = document.getElementById("toggleSidePanelButton");
    sidePanelButton!.onclick = () => this.sidenav!.toggle();
    */

    L.easyButton('<i class="fa-solid fa-bars fa-lg filterIcon"></i>', () => {
      this.sidenav!.toggle();
    }).addTo(this.map).setPosition('topright');

    //Draggable marker
    var blankIcon = L.icon({
      iconUrl: "assets/images/worldmap/icon/blank.png",
      iconSize: [15,15],
      iconAnchor: [7.5,7.5]
    });

    this.dragMarker = L.marker([0, 0], {
    draggable: true,
    icon: blankIcon,
    }).addTo(this.map);
    this.dragMarker.bindPopup('LatLng Marker');
    this.dragMarker.on('dragend', () => {
      this.dragMarker.getPopup().setContent(this.dragMarker.getLatLng().toString()).openOn(this.map);
    });
  }

  public toggleAllLayers(isActive: boolean) : void{
    this.allLayers?.forEach(layer => {
      layer.setActive(isActive);
    });
  }
}
