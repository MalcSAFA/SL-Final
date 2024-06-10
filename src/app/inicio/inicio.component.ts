import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../service/usuario.service';
import { Perfil } from '../modelos/perfil/perfil';
import { Usuario } from '../modelos/usuario/usuario';

@Component({
    selector: 'app-inicio',
    templateUrl: './inicio.component.html',
    styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
    public mostrarPublicarYFeed: boolean = true;
    public mostrarNotificaciones: boolean = false;
    public mostrarExplorar: boolean = false;
    public mostrarListas: boolean = false;
    public perfiles: Perfil[] = [];
    public usuarios: Usuario[] = [];
    public idPerfil: number | null = null;
    public usuarioSeleccionado: Usuario | null = null; // Variable para almacenar el usuario seleccionado

    constructor(private usuarioService: UsuarioService) { }

    ngOnInit(): void {
        // Obtener el ID del perfil del localStorage
        const idPerfilString = localStorage.getItem('idPerfil');
        if (idPerfilString) {
            this.idPerfil = parseInt(idPerfilString);
            // Obtener los perfiles y usuarios
            this.obtenerDatos();
        }
    }

    public mostrarSeccion(seccion: string): void {
        // Oculta todas las secciones
        this.mostrarPublicarYFeed = false;
        this.mostrarNotificaciones = false;
        this.mostrarExplorar = false;
        this.mostrarListas = false;
        // Muestra la sección correspondiente
        if (seccion === 'publicarYFeed') {
            this.mostrarPublicarYFeed = true;
        } else if (seccion === 'notificaciones') {
            this.mostrarNotificaciones = true;
        } else if (seccion === 'explorar') {
            this.mostrarExplorar = true;
        } else if (seccion === 'listas') {
            this.mostrarListas = true;
        }
    }

    obtenerDatos() {
        // Obtener los perfiles
        this.usuarioService.obtenerPerfil().subscribe(
            (perfiles: Perfil[]) => {
                this.perfiles = perfiles;
                // Buscar el perfil cuyo ID coincide con el almacenado en localStorage
                const perfil = this.perfiles.find(p => p.id === this.idPerfil);
                if (perfil) {
                    console.log('Perfil encontrado:', perfil);
                    // Realiza aquí las acciones necesarias con el perfil encontrado
                } else {
                    console.error('No se encontró el perfil con el ID almacenado en localStorage');
                }
            },
            error => {
                console.error('Error al obtener los perfiles:', error);
            }
        );

        // Obtener los usuarios
        this.usuarioService.obtenerUsuario().subscribe(
            (usuarios: any[]) => {
                this.usuarios = usuarios;
                // Buscar el usuario cuyo ID coincide con el almacenado en localStorage
                const usuario = this.usuarios.find(u => u.id === this.idPerfil);
                if (usuario) {
                    console.log('Usuario encontrado:', usuario);
                    // Asignar el usuario encontrado a la variable usuarioSeleccionado
                    this.usuarioSeleccionado = usuario;
                } else {
                    console.error('No se encontró el usuario correspondiente al perfil');
                }
                // Realiza aquí las acciones necesarias con los usuarios obtenidos
            },
            error => {
                console.error('Error al obtener los usuarios:', error);
            }
        );
    }

    cerrarSesion() {
        // Elimina la clave 'idPerfil' del localStorage
        localStorage.removeItem('idPerfil');
        localStorage.removeItem('idLista');
    }

}
