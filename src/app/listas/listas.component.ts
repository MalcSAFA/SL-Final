import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../service/usuario.service';
import { Lista } from '../modelos/lista/lista';
import { Usuario } from '../modelos/usuario/usuario';
import { UsuarioLista } from '../modelos/usuario-lista';

@Component({
  selector: 'app-listas',
  templateUrl: './listas.component.html',
  styleUrls: ['./listas.component.css']
})
export class ListasComponent implements OnInit {
  listas: any = [];
  nombreLista: string = '';
  idUsuario: number;
  listaSeleccionadaId: number | null = null;
  usuariosLista: any = [];
  usuarios: any = [];

  constructor(private usuarioService: UsuarioService) {
    const usuario = JSON.parse(localStorage.getItem('idPerfil')!);
    this.idUsuario = usuario;
  }

  ngOnInit(): void {
    this.obtenerListas();
    const idListaSeleccionada = localStorage.getItem('idLista');
    if (idListaSeleccionada) {
      this.listaSeleccionadaId = parseInt(idListaSeleccionada);
      this.obtenerUsuariosLista();
    }
  }

  obtenerUsuarios(): void {
    this.usuarioService.obtenerUsuario().subscribe(
      (response: any) => {
        // Obtener los usuarios que no están en la lista seleccionada
        this.usuarios = response.filter(
          (usuario: any) =>
            !this.usuariosLista.some((usuario_lista: any) => usuario_lista.usuario.id === usuario.id)
        );
      },
      (error) => {
        console.error('Error al obtener los usuarios:', error);
      }
    );
  }

  obtenerUsuariosLista(): void {
    this.usuarioService.obtenerUsuarioListas().subscribe(
      (response: any[]) => {
        // Filtrar los usuarios_lista por la lista seleccionada
        this.usuariosLista = response.filter(
          (usuarioLista) => usuarioLista.lista.id === this.listaSeleccionadaId
        );
      },
      (error) => {
        console.error('Error al obtener los usuarios de la lista:', error);
      }
    );
    this.obtenerUsuarios();
  }

  obtenerListas(): void {
    this.usuarioService.obtenerListas().subscribe(
      (response: any[]) => {
        this.listas = response.filter(lista => lista.usuario.id === this.idUsuario);
      },
      (error) => {
        console.error('Error al obtener las listas:', error);
      }
    );
  }

  crearLista(): void {
    const nuevaLista: Lista = {
      id_usuario: this.idUsuario,
      nombre_lista: this.nombreLista
    };

    this.usuarioService.crearListas(nuevaLista).subscribe(
      (response) => {
        this.obtenerListas();
        this.nombreLista = '';
      },
      (error) => {
        console.error('Error al crear la lista:', error);
      }
    );
  }

  eliminarLista(id: number): void {
    this.usuarioService.eliminarListas(id).subscribe(
      (response) => {
        this.obtenerListas();
        if (this.listaSeleccionadaId === id) {
          localStorage.removeItem('idLista');
          this.listaSeleccionadaId = null;
        }
      },
      (error) => {
        console.error('Error al eliminar la lista:', error);
      }
    );
  }

  seleccionarLista(id: number): void {
    this.listaSeleccionadaId = id;
    localStorage.setItem('idLista', id.toString());
    this.obtenerUsuariosLista();
  }

  agregarALista(idUsuario: number): void {
    const idLista = Number(localStorage.getItem('idLista'));
    if (!idLista) {
      console.error('ID de lista no encontrado en el localStorage');
      return;
    }

    const nuevaUsuarioLista: UsuarioLista = {
      id_lista: idLista,
      id_usuario: idUsuario
    };

    this.usuarioService.crearUsuarioListas(nuevaUsuarioLista).subscribe(
      (response) => {
        console.log('Usuario agregado a la lista correctamente');
        // Actualizar la lista de usuarios_lista
        this.obtenerUsuariosLista();
      },
      (error) => {
        console.error('Error al agregar usuario a lista:', error);
      }
    );
    window.location.reload();
  }

  eliminarDeLista(idUsuarioLista: number): void {
    this.usuarioService.eliminarUsuarioListas(idUsuarioLista).subscribe(
      (response) => {
        console.log('Usuario eliminado de la lista correctamente');
        // Actualizar la lista de usuarios_lista
        this.obtenerUsuariosLista();
      },
      (error) => {
        console.error('Error al eliminar usuario de lista:', error);
      }
    );
  }

  limpiarIdLista(): void {
    localStorage.removeItem('idLista');
    window.location.reload();
  }


}
