import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSidenav} from '@angular/material/sidenav';
import * as L from 'leaflet';
import 'leaflet-easybutton';
import { TownsLayer } from '../maplayers/locationLayers/towns.maplayer';
import { IAmChildMapLayer, IAmGroupMapLayer, IAmMapLayer } from '../maplayers/maplayer.interface';
import { AltarsLayer } from '../maplayers/layerGroups/altars.maplayer';
import { MirnaLayer } from '../maplayers/altarLayers/mirna.maplayer';
import { VexLayer } from '../maplayers/altarLayers/vex.maplayer';
import { FenlaLayer } from '../maplayers/altarLayers/fenla.maplayer';
import { LocationsLayer } from '../maplayers/layerGroups/locations.maplayers';
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
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { ErrorSnackbarComponent } from 'src/app/snackbars/error-snackbar/error-snackbar.component';
import { InnLayer } from '../maplayers/storeLayers/inn.maplayer';
import { StoresLayer } from '../maplayers/layerGroups/stores.maplayer';
import { AlchemistLayer } from '../maplayers/storeLayers/alchemists.maplayer';
import { ArcheryLayer } from '../maplayers/storeLayers/archery.maplayer';
import { GeneralStoreLayer } from '../maplayers/storeLayers/general-store.maplayers';
import { BlacksmithLayer } from '../maplayers/storeLayers/blacksmith.maplayer';
import { firstValueFrom } from 'rxjs';
import { StableLayer } from '../maplayers/storeLayers/stable.maplayer';
import { FishmongerLayer } from '../maplayers/storeLayers/fishmonger.maplayer';
import { DungeonsLayer } from '../maplayers/poiLayers/dungeons.maplayer';
import { PointsOfInterestLayer } from '../maplayers/layerGroups/pois.maplayer';
import { CavesLayer } from '../maplayers/poiLayers/caves.maplayer';
import { GeonymsLayer } from '../maplayers/locationLayers/geonyms.maplayer';
import { ActivatedRoute } from '@angular/router';
import { LuminLayer } from '../maplayers/poiLayers/lumin.maplayer';
import { GroupLayer } from '../maplayers/poiLayers/group.maplayer';
import { MarkerDto } from 'src/app/services/luminia-api/dtos/markerdto.interface';
import { MapLayerEnum } from 'src/app/services/luminia-api/enums/maplayerenum';
import { BankLayer } from '../maplayers/storeLayers/bank.maplayer';


@Component({
  selector: 'app-worldmap',
  templateUrl: './worldmap.component.html',
  styleUrls: ['./worldmap.component.css']
})

export class WorldmapComponent implements AfterViewInit, OnInit{
  @ViewChild('sidePanel') sidenav: MatSidenav | null = null;
  public layerStates = new Map<IAmMapLayer,boolean>();
  private map! : L.Map;
  public isMobileView : boolean = false;
  public allLayers : IAmGroupMapLayer[] = [];

  private dragMarker : any;
  private dmMode : boolean = false;
  private groupMarker : MarkerDto | undefined;

  @HostListener('window:resize', ['$event'])
  onResize(event: any)
  {
    this.isMobileView = window.innerWidth < 550;
  }

  constructor(private luminiaApiService: LuminiaApiService, private snackBar: MatSnackBar, private route: ActivatedRoute) {
    this.onResize(null);
  }

  async ngAfterViewInit(): Promise<void> {
    await this.initMap();
    await this.initLayers();
    this.moveMap();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['dmCode'] == "1308")
      {
        this.dmMode = true;
      };
    });
  }

  private async initLayers(): Promise<void>
  {
    this.setLocationsGroup();
    this.setPoisGroup();
    this.setStoresGroup();
    this.setAltarsGroup();

    try {
      const allMarkers$ = this.luminiaApiService.getAllMarkers(this.dmMode);
      let allMarkerDtos = await firstValueFrom(allMarkers$);

      //Read group marker for coords
      this.groupMarker = allMarkerDtos.find((marker) => marker.mapLayerId == MapLayerEnum.Group);

      //Create all markers per layer
      allMarkerDtos.forEach(marker => {
        for(const groupLayer of this.allLayers) {
          const foundLayer = groupLayer.childLayers?.find((layer) => layer.mapLayer === marker.mapLayerId);
          if (foundLayer) {
            groupLayer.amount++;
            foundLayer.addMarker(marker);
            return;
          }
        }
      });
    } catch {
      this.snackBar.openFromComponent(ErrorSnackbarComponent, {
        panelClass: 'error-snackbar',
        data: "Markers could not be loaded.",
        duration: 10000
      });
    }
  }

  private async initMap(): Promise<void>{
    //Create the map
    this.map = L.map('map', {attributionControl: false});

    //Get map folder names from DB
    var mapUrl : string;

    try {
      if (this.dmMode) {
        var worldmapDMName$ = this.luminiaApiService.getWorldMapDmName();
        var worldmapDMName = await firstValueFrom(worldmapDMName$);
        mapUrl = worldmapDMName.nameOfFolder;
      }
      else {
        var worldmapName$ = this.luminiaApiService.getWorldMapName();
        var worldmapName =  await firstValueFrom(worldmapName$);
        mapUrl = worldmapName.nameOfFolder;
      }
    }
    catch{
      //Fallback in case DM access fails
      mapUrl = this.dmMode ? 'mapDM' : 'map';

      this.snackBar.openFromComponent(ErrorSnackbarComponent, {
        panelClass: 'error-snackbar',
        data: "Map could not be loaded. (Version shown might be out of date)",
        duration: 10000
      });
    }

    //Create the tile layer
    L.tileLayer('assets/'+ mapUrl +'/{z}/{x}/{y}.png', {
      noWrap: true,
      minZoom: 0,
      maxZoom: 8,
      maxNativeZoom:6,
    }).addTo(this.map);

    L.easyButton('<i class="fa-solid fa-bars fa-lg filterIcon"></i>', () => {
      this.sidenav!.toggle();
    }).addTo(this.map).setPosition('topright');

    //Draggable marker
    var blankIcon = L.icon({
      iconUrl: "assets/images/worldmap/icon/lens.png",
      iconSize: [15,15],
      iconAnchor: [7.5,7.5]
    });

    this.dragMarker = L.marker([0, 0], {
    draggable: true,
    icon: blankIcon,
    }).addTo(this.map);
    this.dragMarker.bindPopup('Position marker');
    this.dragMarker.on('dragend', () => {
      let latlng : L.LatLng = this.dragMarker.getLatLng();
      let markerText = "X= " + latlng.lng.toFixed(6) + ", Y= " + latlng.lat.toFixed(6);
      this.dragMarker.getPopup().setContent(markerText).openOn(this.map);
    });

    //Change opacity of layers based on zoom
    this.map.on('zoomend', () => {
      if (this.map!.getZoom() < 5)
      {
        this.allLayers.forEach(groupLayer => {
          groupLayer.childLayers.forEach(childLayer => {
            if(childLayer.isHiddenWhenZoomedOut)
            {
              childLayer.setOpacity(0);
            }
          });
        });
      }
      else
      {
        this.allLayers.forEach(groupLayer => {
          groupLayer.childLayers.forEach(childLayer => {
            if(childLayer.isHiddenWhenZoomedOut)
            {
              childLayer.setOpacity(1);
            }
          });
        });
      }
    });
  }

  private moveMap() : void {
    if(this.groupMarker !== undefined) {
      this.map.setView([this.groupMarker?.posY, this.groupMarker?.posX], 6);
    }
    else{
      this.map.setView([0, 0], 6);
    }
  }

  public toggleAllLayers(isActive: boolean) : void{
    this.allLayers?.forEach(layer => {
      layer.setActive(isActive);
    });
  }

  public closeDrawer()
  {
    this.sidenav!.close();
  }

  private setLocationsGroup()
  {
    let locationLayers: IAmChildMapLayer[] = [
      new RegionsLayer(this.map),
      new TownsLayer(this.map),
      new GeonymsLayer(this.map),
    ];

    this.allLayers?.push(new LocationsLayer(this.map, locationLayers));
  }

  private setPoisGroup()
  {
    let poisLayers: IAmChildMapLayer[] = [
      new DungeonsLayer(this.map),
      new CavesLayer(this.map),
      new LuminLayer(this.map),
      new GroupLayer(this.map),
    ];

    this.allLayers?.push(new PointsOfInterestLayer(this.map, poisLayers));
  }

  private setAltarsGroup()
  {
    let altarLayers: IAmChildMapLayer[] = [
      new AmataLayer(this.map),
      new AtamaLayer(this.map),
      new CaraLayer(this.map),
      new FenlaLayer(this.map),
      new KazLayer(this.map),
      new KrigonLayer(this.map),
      new LokaineLayer(this.map),
      new MirnaLayer(this.map),
      new TaoidesLayer(this.map),
      new VaknorLayer(this.map),
      new VexLayer(this.map),
      new YuvicLayer(this.map),
    ];

    this.allLayers?.push(new AltarsLayer(this.map, altarLayers));
  }

  private setStoresGroup()
  {
    let storeLayers: IAmChildMapLayer[] = [
      new AlchemistLayer(this.map),
      new ArcheryLayer(this.map),
      new BankLayer(this.map),
      new BlacksmithLayer(this.map),
      new GeneralStoreLayer(this.map),
      new InnLayer(this.map),
      new StableLayer(this.map),
      new FishmongerLayer(this.map)
    ];

    this.allLayers?.push(new StoresLayer(this.map, storeLayers));
  }
}

