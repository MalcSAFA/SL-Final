import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../service/usuario.service';
import { Perfil } from '../modelos/perfil/perfil';
import { Usuario } from '../modelos/usuario/usuario';
import { Seguidores } from '../modelos/seguidores/seguidores';
import { Notificaciones } from '../modelos/notificaciones/notificaciones';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  perfil: Perfil | undefined;
  usuario: Usuario | undefined;
  idEnUrl: number | null = null;
  idEnLocalStorage: number | null = null;
  esMiPerfil: boolean = false;
  mostrarSeguir: boolean = false;
  mostrarDejarDeSeguir: boolean = false;
  mostrarEditarPerfil: boolean = false;
  mostrarContenido: boolean = false; // Nuevo estado para mostrar contenido
  seguidoresCount: number = 0;
  siguiendoCount: number = 0;

  constructor(private route: ActivatedRoute, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.idEnUrl = parseInt(id, 10);
        const idPerfilString = localStorage.getItem('idPerfil');
        if (idPerfilString) {
          this.idEnLocalStorage = parseInt(idPerfilString, 10);
        }
        this.esMiPerfil = this.idEnUrl === this.idEnLocalStorage;

        // Si es mi perfil, siempre mostrar el contenido
        if (this.esMiPerfil) {
          this.mostrarContenido = true;
        }

        // Obtener los datos del perfil y usuarios
        this.obtenerDatos();
      }
    });
  }

  obtenerDatos() {
    if (this.idEnUrl !== null) {
      // Obtener los perfiles
      this.usuarioService.obtenerPerfil().subscribe(
        (perfiles: Perfil[]) => {
          this.perfil = perfiles.find(p => p.id === this.idEnUrl);
          if (this.perfil) {
            console.log('Perfil encontrado:', this.perfil);
          } else {
            console.error('No se encontró el perfil con el ID proporcionado en la ruta');
          }
          // Comprobar seguimiento después de obtener los datos del perfil
          this.comprobarSeguimiento();
          // Obtener recuento de seguidores y siguiendo
          this.obtenerRecuentoSeguidoresSiguiendo();
        },
        error => {
          console.error('Error al obtener los perfiles:', error);
        }
      );

      // Obtener los usuarios
      this.usuarioService.obtenerUsuario().subscribe(
        (usuarios: any[]) => {
          this.usuario = usuarios.find(u => u.id === this.idEnUrl);
          if (this.usuario) {
            console.log('Usuario encontrado:', this.usuario);
          } else {
            console.error('No se encontró el usuario con el ID proporcionado en la ruta');
          }
        },
        error => {
          console.error('Error al obtener los usuarios:', error);
        }
      );
    }
  }

  comprobarSeguimiento() {
    if (this.idEnLocalStorage && this.idEnUrl) {
      this.usuarioService.obtenerSeguidores().subscribe(
        (seguidores: Seguidores[]) => {
          console.log('Seguidores obtenidos:', seguidores); // Log para ver los datos obtenidos
          const yaSiguiendo = seguidores.some(s => s.idUsuarioSeguidor === this.idEnLocalStorage && s.idUsuarioSeguido === this.idEnUrl);
          console.log('¿Ya sigue?', yaSiguiendo); // Log para ver el resultado de la comprobación
          this.mostrarSeguir = !yaSiguiendo && !this.esMiPerfil;
          this.mostrarDejarDeSeguir = yaSiguiendo && !this.esMiPerfil;

          // Determinar si se debe mostrar el contenido basado en la privacidad y seguimiento
          if (!this.esMiPerfil) {
            this.mostrarContenido = this.perfil?.subidas !== 1 || yaSiguiendo;
          }
        },
        error => {
          console.error('Error al comprobar seguimiento:', error);
        }
      );
    }
  }

  obtenerRecuentoSeguidoresSiguiendo() {
    this.usuarioService.obtenerSeguidores().subscribe(
      (seguidores: Seguidores[]) => {
        // Contar seguidores
        this.seguidoresCount = seguidores.filter(s => s.idUsuarioSeguido === this.idEnUrl).length;
        // Contar siguiendo
        this.siguiendoCount = seguidores.filter(s => s.idUsuarioSeguidor === this.idEnUrl).length;
      },
      error => {
        console.error('Error al obtener el recuento de seguidores y siguiendo:', error);
      }
    );
  }

  seguirPerfil() {
    if (this.idEnLocalStorage && this.idEnUrl) {
      const nuevoSeguimiento: Seguidores = {
        idUsuarioSeguidor: this.idEnLocalStorage,
        idUsuarioSeguido: this.idEnUrl,
        fechaSeguimiento: new Date().toISOString()
      };
      this.usuarioService.crearSeguidores(nuevoSeguimiento).subscribe(
        () => {
          console.log('Perfil seguido correctamente');
          this.mostrarSeguir = false;
          this.mostrarDejarDeSeguir = true;

          // Crear notificación
          const notificacion: Notificaciones = {
            id_usuarioEm: this.idEnLocalStorage,
            id_usuarioRe: this.idEnUrl,
            tipoNotificacion: 'seguir',
            visto: false
          };

          this.usuarioService.crearNotificaciones(notificacion).subscribe(
            () => {
              console.log('Notificación de seguimiento creada correctamente');
            },
            error => {
              console.error('Error al crear la notificación de seguimiento:', error);
            }
          );
        },
        error => {
          console.error('Error al seguir el perfil:', error);
        }
      );
    } else {
      console.error('No se pudo obtener el ID del perfil desde el localStorage o la URL');
    }
  }

  dejarDeSeguirPerfil() {
    if (this.idEnLocalStorage && this.idEnUrl) {
      this.usuarioService.obtenerSeguidores().subscribe(
        (seguidores: Seguidores[]) => {
          const seguimiento = seguidores.find(s => s.idUsuarioSeguidor === this.idEnLocalStorage && s.idUsuarioSeguido === this.idEnUrl);
          if (seguimiento && seguimiento.id) {
            this.usuarioService.eliminarSeguidores(seguimiento.id).subscribe(
              () => {
                console.log('Se ha dejado de seguir al perfil correctamente');
                this.mostrarSeguir = true;
                this.mostrarDejarDeSeguir = false;
              },
              error => {
                console.error('Error al dejar de seguir al perfil:', error);
              }
            );
          }
        },
        error => {
          console.error('Error al obtener los seguidores:', error);
        }
      );
    } else {
      console.error('No se pudo obtener el ID del perfil desde el localStorage o la URL');
    }
  }

  mostrarEditar(): void {
    this.mostrarEditarPerfil = true;
  }
}
