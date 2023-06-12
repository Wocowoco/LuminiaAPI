import { Component, OnInit} from '@angular/core';
import { IDeityInfo } from '../deity-info.interface';
import { CaraDeityInfo } from '../deity-info/cara-deity-info';
import { FenlaDeityInfo } from '../deity-info/fenla-deity-info';
import { AmataDeityInfo } from '../deity-info/amata-deity-info';
import { AtamaDeityInfo } from '../deity-info/atama-deity-info';
import { KazDeityInfo } from '../deity-info/kaz-deity-info';
import { KrigonDeityInfo } from '../deity-info/krigon-deity-info';
import { LokaineDeityInfo } from '../deity-info/lokaine-deity-info';
import { MirnaDeityInfo } from '../deity-info/mirna-deity-info';
import { TaoidesDeityInfo } from '../deity-info/taoides-deity-info';
import { VaknorDeityInfo } from '../deity-info/vaknor-deity-info';
import { VexDeityInfo } from '../deity-info/vex-deity-info';
import { YuvicDeityInfo } from '../deity-info/yuvic-deity-info';


@Component({
  selector: 'app-pantheon-page',
  templateUrl: './pantheon-page.component.html',
  styleUrls: ['./pantheon-page.component.css']
})

export class PantheonPageComponent implements OnInit {
  constructor() { }

  whitePantheonInfo : IDeityInfo[] = [
    new CaraDeityInfo(),
    new FenlaDeityInfo(),
    new KazDeityInfo(),
    new YuvicDeityInfo(),
  ];

  greyPantheonInfo : IDeityInfo[] = [
    new AmataDeityInfo(),
    new AtamaDeityInfo(),
    new MirnaDeityInfo(),
    new TaoidesDeityInfo(),
  ];

  blackPantheonInfo : IDeityInfo[] = [
    new KrigonDeityInfo(),
    new LokaineDeityInfo(),
    new VaknorDeityInfo(),
    new VexDeityInfo(),
  ];

  ngOnInit(): void {
  }

  navigate(navigateTo: string): void {
    const element = document.getElementById(navigateTo);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

}
