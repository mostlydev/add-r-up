import { Globalization } from '@ionic-native/globalization';
import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { TranslateModule } from 'ng2-translate/ng2-translate';
import { TranslateService } from 'ng2-translate';
import { defaultLanguage, availableLanguages, sysOptions } from './home.constants';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  pot = 400;
  prizes = [0, 0, 0, 0, 0];
  percents = [0, 27.5, 10.5, 5, 2];
  loaded: boolean = false;
  smallestBill: string = "10";
  smallestPrize: string = "20";

  languages = availableLanguages;
  selectedLanguage = sysOptions.systemLanguage;

  param = { value: 'world' };

  private translate: TranslateService;

  constructor(
    public navCtrl: NavController,
    platform: Platform,
    private globalization: Globalization,
    translate: TranslateService,
    private storage: Storage
  ) {
    this.percents[0] = 100 - (this.percents.reduce(function (a, b) {
      return a + b;
    }, 0));
    this.translate = translate;

    platform.ready().then(() => {
      // this language will be used as a fallback when a translation isn't found in the current language
      translate.setDefaultLang(defaultLanguage);

      if ((<any>window).cordova) {
        this.globalization.getPreferredLanguage().then(
          (result) => {
            var language = this.getSuitableLanguage(result.value);
            translate.use(language);
            sysOptions.systemLanguage = language;
          });
      } else {
        let browserLanguage = translate.getBrowserLang() || defaultLanguage;
        var language = this.getSuitableLanguage(browserLanguage);
        translate.use(language);
        sysOptions.systemLanguage = language;
      }
    }
    );
  }

  ngOnInit() {
    this.applyLanguage();
    this.loadDefaults();
    this.recalculate();
  }

  saveDefaults() {
    this.storage.set('pot', this.pot);
    this.storage.set('smallestBill', this.smallestBill);
    this.storage.set('smallestPrize', this.smallestPrize);
  }

  loadDefaults() {
    this.storage.get('pot').then((pot) => {
      if (pot) {
        this.pot = pot;
        this.recalculate();
      }
    });
    this.storage.get('smallestBill').then((smallestBill) => {
      if (smallestBill) {
        this.smallestBill = smallestBill;
        this.recalculate();
      }
    });
    this.storage.get('smallestPrize').then((smallestPrize) => {
      if (smallestPrize) {
        this.smallestPrize = smallestPrize;
        this.recalculate();
      }
    });
  }

  onKey(evt) {
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode == 9) {
      evt.preventDefault();
      evt.target.blur();
    }
  }

  getSuitableLanguage(language) {
    language = language.substring(0, 2).toLowerCase();
    return availableLanguages.some(x => x.code == language) ? language : defaultLanguage;
  }

  applyLanguage() {
    this.translate.use(this.selectedLanguage);
  }

  onChange() {
    this.saveDefaults();
    this.recalculate();
  }

  recalculate() {
    const smallestBill = parseInt(this.smallestBill, 10);
    const minPrize = parseInt(this.smallestPrize, 10);
    for (var _i = 0; _i < this.percents.length; _i++) {
      this.prizes[_i] = this.floorTo(this.pot * this.percents[_i] / 100, smallestBill);
      if (this.prizes[_i] < minPrize) this.prizes[_i] = 0;
    }

    this.prizes[0] = this.prizes[0] + (this.pot - this.sumArray(this.prizes));
    this.loaded = true;
  }

  floorTo(value: number, floor: number = 10): number {
    return Math.floor(value / floor) * floor
  }

  sumArray(numArray: Array<number>): number {
    return numArray.reduce((a, b) => a + b, 0)
  }
}
