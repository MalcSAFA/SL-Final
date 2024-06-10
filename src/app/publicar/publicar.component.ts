import { Component } from '@angular/core';
import { TweetService } from '../service/tweet.service';
import { UsuarioService } from '../service/usuario.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-publicar',
  templateUrl: './publicar.component.html',
  styleUrls: ['./publicar.component.css']
})
export class PublicarComponent {

  constructor(
    private tweetService: TweetService,
    private usuarioService: UsuarioService
  ) {
    const idPerfil = localStorage.getItem('idPerfil');
    if (idPerfil) {
      this.nuevoTweet.id_usuario = parseInt(idPerfil, 10);
    }
  }

  nuevoTweet = { texto: '', link: '', id_usuario: 0 };
  tweetClicked: boolean = false;
  addIMGClicked: boolean = false;

  addIMG() {
    this.addIMGClicked = true;
  }

  crearTweets() {
    if (!this.nuevoTweet.texto) {
      this.tweetClicked = true; // Establecer tweetClicked a true si el textarea está vacío
      return; // Detener la ejecución de la función si el textarea está vacío
    }

    this.tweetService.crearTweets(this.nuevoTweet).subscribe(data => {
      console.log('Tweet creado:', data);

      // Detectar menciones en el texto del tweet
      const menciones = this.detectarMenciones(this.nuevoTweet.texto);
      console.log('Menciones detectadas:', menciones);

      if (menciones.length > 0) {
        // Crear notificaciones para cada mención
        this.usuarioService.obtenerUsuario().subscribe(usuarios => {
          console.log('Usuarios obtenidos:', usuarios);

          const notificacionesObservables = menciones.map(mencion => {
            const usuario = usuarios.find((u: any) => u.nick === mencion);
            if (usuario && usuario.id !== this.nuevoTweet.id_usuario) {
              const notificacion = {
                id_usuarioEm: this.nuevoTweet.id_usuario,
                id_usuarioRe: usuario.id,
                tipoNotificacion: 'mencion',
                visto: false
              };
              return this.usuarioService.crearNotificaciones(notificacion);
            } else {
              return null;
            }
          }).filter(obs => obs !== null);

          forkJoin(notificacionesObservables).subscribe(
            responses => {
              console.log('Todas las notificaciones de mención creadas:', responses);
              // Recargar la página después de crear todas las notificaciones
              window.location.reload();
            },
            error => {
              console.error('Error al crear las notificaciones de mención', error);
            }
          );
        });
      } else {
        // No hay menciones, recargar la página inmediatamente
        window.location.reload();
      }
    });
  }

  detectarMenciones(texto: string): string[] {
    const menciones = texto.match(/@\w+/g);
    return menciones ? menciones.map(mencion => mencion.substring(1)) : [];
  }
}
