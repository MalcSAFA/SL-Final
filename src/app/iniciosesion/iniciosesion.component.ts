import { Component } from '@angular/core';
import { UsuarioService } from '../service/usuario.service';
import * as bcrypt from 'bcryptjs';
import { Perfil } from '../modelos/perfil/perfil';

@Component({
  selector: 'app-iniciosesion',
  templateUrl: './iniciosesion.component.html',
  styleUrls: ['./iniciosesion.component.css']
})
export class IniciosesionComponent {
  usuario: any[] = [];
  perfiles: Perfil[] = [];
  correo: string = '';
  contrasenya: string = '';
  mensajeError: string = '';
  usuarioClicked: boolean = false;

  constructor(private usuarioService: UsuarioService) { }

  iniciarSesion() {
    if (!this.contrasenya || !this.correo) {
      this.usuarioClicked = true;
      return;
    }

    this.usuarioService.obtenerUsuario().subscribe(
      (usuarios: any[]) => {
        const usuario = usuarios.find(u => u.correo === this.correo);

        if (usuario) {
          if (bcrypt.compareSync(this.contrasenya, usuario.contrasenya)) {
            // Una vez que se ha verificado la contraseña, comparamos el id del usuario con el id del perfil
            if (usuario.id) {
              localStorage.setItem('idPerfil', usuario.id.toString());
              window.location.href = '/inicio';
            } else {
              console.error('El id del usuario es undefined');
            }
          } else {
            this.mensajeError = 'La contraseña ingresada es incorrecta';
          }
        } else {
          this.mensajeError = 'El correo electrónico ingresado no está registrado';
        }
      },
      error => {
        console.error('Error al obtener los usuarios', error);
      }
    );
  }
}
