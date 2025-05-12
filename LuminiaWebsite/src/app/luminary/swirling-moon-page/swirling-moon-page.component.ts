import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-swirling-moon-page',
  templateUrl: './swirling-moon-page.component.html',
  styleUrls: ['./swirling-moon-page.component.css'],
})
export class SwirlingMoonPageComponent implements OnInit {

  constructor() { }

  public moonerangText: string =`
  You conjure a crescent wave of radiant moonlight shaped like a boomerang and hurl it at a creature within range. Make a ranged spell attack against the target. On a hit, the target takes <b>3d6 radiant damage</b>, and the Moonerang arcs back toward you.
  <br><br>
  When the Moonerang returns, you can choose one of the following options:
  <br>
  <ul>
  <li><b>End the Spell.</b> If this is the first time the Moonerang has returned, you can choose to end the spell and regain the spell slot used to cast it.</li>
  <li><b>Bounce the Spell.</b> You redirect the Moonerang toward another creature within 20 feet. Make a new ranged spell attack against the new target. For each previous target the spell has struck, you take <b>1d6 radiant damage</b> before making the new attack.</li>
  </ul>
  The spell ends after you choose to end it or after it fails to hit a target on a bounce.
  <br><br>
  <b>At Higher Levels.</b> When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d6 for each slot level above 2nd.
  `;

  public lunarShieldText: string =`
  You draw upon the moonlight, absorbing its celestial energy and releasing it in a burst of radiant starlight. Choose any number of creatures within 10 feet of you. Each chosen creature gains temporary hit points equal to <b>2d6 + your spellcasting ability modifier</b>.
  <br><br>
  <b>At Higher Levels.</b> When you cast this spell using a spell slot of 3rd level or higher, the temporary hit points increase by 1d6 for each slot level above 2nd.
  `;

  ngOnInit(): void {
  }

  navigate(navigateTo: string): void {
    const element = document.getElementById(navigateTo);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
