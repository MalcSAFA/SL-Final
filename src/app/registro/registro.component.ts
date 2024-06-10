import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../service/usuario.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  usuario: any[] = [];
  nuevoUsuario = { nombre: '', apellido: '', nick: '', contrasenya: '', correo: '', foto: '', fecha_nacimiento: '', rol: 'user' };
  usuarioClicked: boolean = false;
  correoEnUso: boolean = false;

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.obtenerUsuario();
  }

  obtenerUsuario() {
    this.usuarioService.obtenerUsuario().subscribe(
      (response: any[]) => {
        this.usuario = response;
      },
      error => {
        console.error('Error al obtener los usuarios', error);
      }
    );
  }

  crearUsuario() {
    // Verifica si algún campo está vacío
    if (!this.nuevoUsuario.nombre || !this.nuevoUsuario.apellido || !this.nuevoUsuario.nick || !this.nuevoUsuario.contrasenya || !this.nuevoUsuario.correo || !this.nuevoUsuario.foto || !this.nuevoUsuario.fecha_nacimiento) {
      this.usuarioClicked = true;
      return;
    }

    // Verifica si el correo ya está en uso
    this.correoEnUso = this.usuario.some(user => user.correo === this.nuevoUsuario.correo);
    if (this.correoEnUso) {
      return;
    }

    // Si el correo no está en uso, crea el usuario
    this.usuarioService.crearUsuario(this.nuevoUsuario).subscribe(
      data => {
        console.log(data);
        // Actualiza la lista de usuarios después de crear el nuevo usuario
        this.obtenerUsuario();
      },
      error => {
        console.error('Error al crear el usuario', error);
      }
    );
  }
}
