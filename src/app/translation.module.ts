import { en } from '../assets/i18n/en';
import { fr } from '../assets/i18n/fr';

import { Observable } from 'rxjs/Observable';
import { NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateService } from '@ngx-translate/core';

export class CustomTranslateLoader implements TranslateLoader {
    public getTranslation(lang: string): Observable<any> {
        return Observable.create(observer => {
            if (lang == 'fr') {
                observer.next(fr);
            } else {
                observer.next(en);
            }
            observer.complete();
        });
}
    }

const translationOptions = {
  loader: {
    provide: TranslateLoader,
    useClass: CustomTranslateLoader
  }
};

@NgModule({
  imports: [TranslateModule.forRoot(translationOptions)],
  exports: [TranslateModule],
  providers: [TranslateService]
})
export class TranslationModule {
  constructor(private translate: TranslateService) {
    translate.addLangs(['en']);
    translate.setDefaultLang('en');
    translate.use('en');
  }
}
