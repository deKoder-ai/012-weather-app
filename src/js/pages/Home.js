'use strict';

import { F } from '../Functions';
import { ImageArray } from '../Classes/Slideshow/ImageArray';
import { Slideshow } from '../Classes/Slideshow/Slideshow';

import html from './Weather/weather.html';
import { Weather } from './Weather/Weather';

class Home {
  constructor(content) {
    console.log('home at last');
    content.innerHTML = '';
    this.home = F.htmlElement('div', '', '', 'home-page');

    this.html = html;
    content.innerHTML = this.html;

    const weather = new Weather();

    return this.home;
  }
}

export { Home };
