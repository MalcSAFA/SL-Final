import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './principal/principal.component';
import { InformacionComponent } from './informacion/informacion.component';
import { CondicionesComponent } from './condiciones/condiciones.component';
import { PrivacidadComponent } from './privacidad/privacidad.component';
import { RegistroComponent } from './registro/registro.component';
import { IniciosesionComponent } from './iniciosesion/iniciosesion.component';
import { InicioComponent } from './inicio/inicio.component';
import { PerfilComponent } from './perfil/perfil.component';

const routes: Routes = [
  { path: '', component: PrincipalComponent },
  { path: 'informacion', component: InformacionComponent },
  { path: 'condiciones', component: CondicionesComponent },
  { path: 'privacidad', component: PrivacidadComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'iniciosesion', component: IniciosesionComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'perfil/:id', component: PerfilComponent }, // Ruta con parámetro dinámico
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
