import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrincipalComponent } from './principal/principal.component';
import { InformacionComponent } from './informacion/informacion.component';
import { CondicionesComponent } from './condiciones/condiciones.component';
import { PrivacidadComponent } from './privacidad/privacidad.component';
import { RegistroComponent } from './registro/registro.component';
import { IniciosesionComponent } from './iniciosesion/iniciosesion.component';
import { InicioComponent } from './inicio/inicio.component';
import { PublicarComponent } from './publicar/publicar.component';
import { FeedComponent } from './feed/feed.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { ListasComponent } from './listas/listas.component';
import { ExplorarComponent } from './explorar/explorar.component';
import { PerfilComponent } from './perfil/perfil.component';
import { EditarperfilComponent } from './editarperfil/editarperfil.component';
import { FeedperfilComponent } from './feedperfil/feedperfil.component';
import { FeedlistaComponent } from './feedlista/feedlista.component';

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    InformacionComponent,
    CondicionesComponent,
    PrivacidadComponent,
    RegistroComponent,
    IniciosesionComponent,
    InicioComponent,
    PublicarComponent,
    FeedComponent,
    NotificacionesComponent,
    ListasComponent,
    ExplorarComponent,
    PerfilComponent,
    EditarperfilComponent,
    FeedperfilComponent,
    FeedlistaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
