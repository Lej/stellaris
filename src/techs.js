import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

import {Stellaris} from './logic/stellaris';

@inject(HttpClient, Stellaris)
export class Technologies {
  
  heading = 'Technologies';

  constructor(http, stellaris) {
    this.http = http;
    this.stellaris = stellaris;
  }

  activate() {
    this.stellaris.getTechs().then(techs => this.techs = techs);
  }
}
