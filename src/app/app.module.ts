import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeFreeze } from 'ngrx-store-freeze';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from '@app/core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { JwtInterceptor } from '@app/authentication/jwt.interceptor';
import { FileUploadModule } from 'ng2-file-upload';
import { AuthenticatedHttpInterceptor } from '@app/authentication/authenticated-http.interceptor';
import { AuthenticationService } from '@app/core';
import { HeaderInterceptor } from './shared/interceptors/header.interceptor';
import { ToastrModule } from 'ngx-toastr';

export const metaReducers: any[] = !environment.production ? [storeFreeze] : [];

export const httpInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HeaderInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthenticatedHttpInterceptor,
    multi: true,
    deps: [AuthenticationService]
  }
];

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    FileUploadModule,
    AppRoutingModule,
    StoreModule.forRoot([], { metaReducers }),
    EffectsModule.forRoot([]),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-left',
      preventDuplicates: true,
      progressAnimation: 'decreasing'
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    environment.production ? [] : StoreDevtoolsModule.instrument(),
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [
    AppComponent,
  ],
  providers: [
    ...httpInterceptorProviders,
  ],
})
export class AppModule {}
