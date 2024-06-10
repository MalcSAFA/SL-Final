import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../service/usuario.service';
import { Usuario } from '../modelos/usuario/usuario';
import { Perfil } from '../modelos/perfil/perfil';

@Component({
  selector: 'app-editarperfil',
  templateUrl: './editarperfil.component.html',
  styleUrls: ['./editarperfil.component.css']
})
export class EditarperfilComponent implements OnInit {
  usuario: Usuario | undefined;
  perfil: Perfil | undefined;

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.obtenerUsuario();
    this.obtenerPerfil();
  }

  obtenerUsuario(): void {
    const idPerfilString = localStorage.getItem('idPerfil');
    if (idPerfilString) {
      const idPerfil = parseInt(idPerfilString);
      this.usuarioService.obtenerUsuario().subscribe(
        (usuarios: Usuario[]) => {
          this.usuario = usuarios.find(u => u.id === idPerfil);
          if (this.usuario) {
            console.log('Usuario encontrado:', this.usuario);
          } else {
            console.error('No se encontró el usuario con el ID en localStorage');
          }
        },
        error => {
          console.error('Error al obtener los usuarios:', error);
        }
      );
    }
  }

  actualizarUsuario(): void {
    if (this.usuario && this.usuario.id) {
      this.usuarioService.cambioUsuario(this.usuario.id, this.usuario).subscribe(
        response => {
          console.log('Usuario actualizado:', response);
          // Aquí puedes agregar cualquier lógica adicional después de la actualización
          window.location.reload();
        },
        error => {
          console.error('Error al actualizar el usuario:', error);
        }
      );
    }
  }

  obtenerPerfil(): void {
    const idPerfilString = localStorage.getItem('idPerfil');
    if (idPerfilString) {
      const idPerfil = parseInt(idPerfilString);
      this.usuarioService.obtenerPerfil().subscribe(
        (perfiles: Perfil[]) => {
          this.perfil = perfiles.find(p => p.id === idPerfil);
          if (this.perfil) {
            console.log('Usuario encontrado:', this.perfil);
          } else {
            console.error('No se encontró el usuario con el ID en localStorage');
          }
        },
        error => {
          console.error('Error al obtener los usuarios:', error);
        }
      );
    }
  }

  actualizarPerfil(): void {
    if (this.perfil && this.perfil.id) {
      this.usuarioService.cambioPerfil(this.perfil.id, this.perfil).subscribe(
        response => {
          console.log('Usuario actualizado:', response);
          // Aquí puedes agregar cualquier lógica adicional después de la actualización
          window.location.reload();
        },
        error => {
          console.error('Error al actualizar el usuario:', error);
        }
      );
    }
  }
}
