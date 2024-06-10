import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../service/usuario.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {
  notificacionesLista: any[] = [];

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.obtenerNotificaciones();
  }

  obtenerNotificaciones(): void {
    const idPerfil = parseInt(localStorage.getItem('idPerfil') ?? '0', 10);
    this.usuarioService.obtenerNotificaciones().subscribe(
      (response: any) => {
        this.notificacionesLista = response.filter((notificacion: any) => notificacion.usuarioReceptor.id === idPerfil);
      },
    );
  }
}
