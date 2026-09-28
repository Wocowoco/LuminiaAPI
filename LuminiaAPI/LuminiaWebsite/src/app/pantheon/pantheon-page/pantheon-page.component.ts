import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IDeityInfo } from '../deity-info.interface';
import { CaraDeityInfo } from '../deity-info/cara-deity-info';
import { FenlaDeityInfo } from '../deity-info/fenla-deity-info';
import { AmataDeityInfo } from '../deity-info/amata-deity-info';
import { AtamaDeityInfo } from '../deity-info/atama-deity-info';
import { KazDeityInfo } from '../deity-info/kaz-deity-info';
import { KrigonDeityInfo } from '../deity-info/krigon-deity-info';
import { LokaineDeityInfo } from '../deity-info/lokaine-deity-info';
import { LuanaDeityInfo } from '../deity-info/luana-deity-info';
import { MirnaDeityInfo } from '../deity-info/mirna-deity-info';
import { TaoidesDeityInfo } from '../deity-info/taoides-deity-info';
import { VaknorDeityInfo } from '../deity-info/vaknor-deity-info';
import { VexDeityInfo } from '../deity-info/vex-deity-info';
import { YuvicDeityInfo } from '../deity-info/yuvic-deity-info';

interface Pantheon {
  name: string;
  tone: 'white' | 'grey' | 'black' | 'minor';
  deities: IDeityInfo[];
}

@Component({
    selector: 'app-pantheon-page',
    templateUrl: './pantheon-page.component.html',
    styleUrls: ['./pantheon-page.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})

export class PantheonPageComponent {
  pantheons: Pantheon[] = [
    {
      name: 'White Pantheon',
      tone: 'white',
      deities: [new CaraDeityInfo(), new FenlaDeityInfo(), new KazDeityInfo(), new YuvicDeityInfo()],
    },
    {
      name: 'Grey Pantheon',
      tone: 'grey',
      deities: [new AmataDeityInfo(), new AtamaDeityInfo(), new MirnaDeityInfo(), new TaoidesDeityInfo()],
    },
    {
      name: 'Black Pantheon',
      tone: 'black',
      deities: [new KrigonDeityInfo(), new LokaineDeityInfo(), new VaknorDeityInfo(), new VexDeityInfo()],
    },
    {
      name: 'Minor Deities',
      tone: 'minor',
      deities: [new LuanaDeityInfo()],
    },
  ];

  /** Splits a title into plain text and the words that hide a secret (see IDeityInfo.secrets). */
  titleParts(info: IDeityInfo, title: string): { text: string; secretKey?: string }[] {
    const words = Object.keys(info.secrets ?? {});
    if (words.length == 0) {
      return [{ text: title }];
    }

    const escaped = words.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    return title
      .split(new RegExp(`(${escaped.join('|')})`))
      .filter(text => text.length > 0)
      .map(text => ({ text, secretKey: info.secrets![text] }));
  }

  domainsOf(info: IDeityInfo): string[] {
    return info.domains.split(',').map(domain => domain.trim());
  }

  navigate(navigateTo: string): void {
    const element = document.getElementById(navigateTo);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
