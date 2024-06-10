import { Component, OnInit } from '@angular/core';
import { TweetService } from '../service/tweet.service';
import { UsuarioService } from '../service/usuario.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  usuario: any[] = [];
  likes: any[] = [];
  rts: any[] = [];
  mostrarRespuestas: { [tweetId: number]: boolean } = {}; // Objeto para almacenar el estado de las respuestas
  respuestas: any[] = [];

  tweets: any[] = [];


  formatTweetText(texto: string): string {
    const urlRegex = /(www\.[^\s]+)/g;
    return texto.replace(urlRegex, '<a href="http://$1" target="_blank">$1</a>');
  }

  formatRespuestaText(texto: string): string {
    const urlRegex = /(www\.[^\s]+)/g;
    return texto.replace(urlRegex, '<a href="http://$1" target="_blank">$1</a>');
  }


  constructor(private tweetService: TweetService, private usuarioService: UsuarioService) {
    const idPerfil = localStorage.getItem('idPerfil');
    if (idPerfil) {
      this.nuevoRespuesta.id_usuario = parseInt(idPerfil, 10);
    }
  }



  ngOnInit(): void {
    this.obtenerUsuario();
    this.obtenerLikes();
    this.obtenerRTs();
    this.obtenerRespuestas();
    this.nuevoRespuesta.id_usuario = Number(localStorage.getItem('idPerfil')) || 0;
    this.obtenerUsuariosSeguidos(); // Agregar esta línea para obtener los usuarios seguidos
    this.obtenerTweetsDeUsuariosSeguidos();

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

  contarRespuestas(tweetId: number): number {
    return this.respuestas.filter(respuesta => respuesta.tweet.id === tweetId).length;
  }


  toggleRespuestas(tweetId: number) {
    this.mostrarRespuestas[tweetId] = !this.mostrarRespuestas[tweetId]; // Alternar el estado de las respuestas para el tweet
  }

  usuariosSeguidos: any[] = [];


  obtenerUsuariosSeguidos() {
    const idPerfil = localStorage.getItem('idPerfil');
    if (!idPerfil) {
      console.error('No se puede obtener el ID de perfil.');
      return;
    }

    const idPerfilNum = parseInt(idPerfil, 10);

    this.usuarioService.obtenerSeguidores().subscribe(
      (seguidores: any[]) => {
        console.log('Seguidores obtenidos:', seguidores);

        // Filtrar los seguidores para obtener solo aquellos que coinciden con el ID del perfil
        const seguidoresDelPerfil = seguidores.filter(seg => seg.idUsuarioSeguidor === idPerfilNum);
        console.log('Seguidores del perfil:', seguidoresDelPerfil);

        // Obtener los IDs de los usuarios seguidos
        this.usuariosSeguidos = seguidoresDelPerfil.map(seg => seg.idUsuarioSeguido);
        console.log('IDs de usuarios seguidos:', this.usuariosSeguidos);

        // Verificar si el usuario actual está siguiendo a alguien
        const estoySiguiendo = this.usuariosSeguidos.length > 0;
        console.log('¿Estoy siguiendo?', estoySiguiendo);

        // Si el usuario actual está siguiendo al menos a un usuario, obtener los tweets de los usuarios seguidos
        if (estoySiguiendo) {
          this.obtenerTweetsDeUsuariosSeguidos();
        }
        this.obtenerTweetsDeUsuariosSeguidos();
      },
      error => {
        console.error('Error al obtener los usuarios seguidos:', error);
      }
    );
  }


  obtenerTweetsDeUsuariosSeguidos() {
    if (this.usuariosSeguidos.length === 0) {
      console.warn('No sigue a ningún usuario.');
    }

    // Obtener el idPerfil del localStorage y convertirlo a número
    const idPerfilPropioString = localStorage.getItem('idPerfil');

    // Verificar si idPerfilPropioString es null o no
    if (idPerfilPropioString !== null) {
      // Convertir el idPerfilPropioString a número
      const idPerfilPropio = parseInt(idPerfilPropioString, 10);

      // Verificar si el idPerfilPropio es un número válido
      if (!isNaN(idPerfilPropio)) {
        // Agregar el idPerfil propio a la lista de usuarios seguidos
        const usuariosASeguir = [...this.usuariosSeguidos, idPerfilPropio];
        console.log('hola', this.usuariosSeguidos, idPerfilPropio)

        this.tweetService.obtenerTweets().subscribe(
          (tweets: any[]) => {
            // Filtrar los tweets para mostrar los propios y los de los usuarios seguidos
            this.tweets = tweets.filter(tweet => usuariosASeguir.includes(tweet.usuario.id));
          },
          error => {
            console.error('Error al obtener los tweets:', error);
          }
        );
      } else {
        console.error('El idPerfil en localStorage no es un número válido.');
      }
    } else {
      console.error('El idPerfil en localStorage es nulo.');
    }
  }





  obtenerRespuestas() {
    this.tweetService.obtenerRespuestas().subscribe(
      (response: any[]) => {
        this.respuestas = response;
      },
      error => {
        console.error('Error al obtener las respuestas', error);
      }
    );
  }

  nuevoRespuesta = { texto: '', id_usuario: 0, id_tweet: 0 };

  respuestaClicked: boolean = false;

  crearRespuesta(id_tweet: number) {
    if (!this.nuevoRespuesta.texto) {
      this.respuestaClicked = true; // Establecer tweetClicked a true si el textarea está vacío
      return; // Detener la ejecución de la función si el textarea está vacío
    }
    this.nuevoRespuesta.id_tweet = id_tweet;
    this.tweetService.crearRespuestas(this.nuevoRespuesta).subscribe(data => {
      console.log(data);
      this.obtenerRespuestas(); // Volver a obtener las respuestas después de crear una nueva
      this.nuevoRespuesta.texto = ''; // Limpiar el campo de texto
      this.crearNotificacion('respuesta', id_tweet);
    });
  }


  obtenerLikes() {
    this.tweetService.obtenerLikes().subscribe(
      (response: any[]) => {
        this.likes = response;
      },
      error => {
        console.error('Error al obtener los likes', error);
      }
    );
  }

  contarLikes(tweetId: number): number {
    return this.likes.filter(like => like.tweet.id === tweetId).length;
  }

  nuevoLike = { id_usuario: 0, id_tweet: 0 };


  likeTweet(tweetId: number) {
    const userId = parseInt(localStorage.getItem('idPerfil') ?? '0', 10);
    const existingLike = this.likes.find(like => like.tweet.id === tweetId && like.usuario.id === userId);

    if (existingLike) {
      // Si ya existe un like, eliminarlo
      this.unlikeTweet(existingLike.id);
    } else {
      // Si no existe un like, crear uno nuevo
      this.nuevoLike.id_tweet = tweetId;
      this.nuevoLike.id_usuario = userId;

      this.tweetService.crearLikes(this.nuevoLike).subscribe(data => {
        this.obtenerLikes();
        this.crearNotificacion('like', tweetId);

      });
    }
  }

  unlikeTweet(likeId: number) {
    this.tweetService.eliminarLikes(likeId).subscribe(data => {
      this.obtenerLikes();
    });
  }

  checkIfLiked(tweetId: number): boolean {
    const userId = parseInt(localStorage.getItem('idPerfil') ?? '0', 10);
    return this.likes.some(like => like.tweet.id === tweetId && like.usuario.id === userId);
  }





















  obtenerRTs() {
    this.tweetService.obtenerRT().subscribe(
      (response: any[]) => {
        this.rts = response;
      },
      error => {
        console.error('Error al obtener los rts', error);
      }
    );
  }

  contarRTs(tweetId: number): number {
    return this.rts.filter(rt => rt.tweet.id === tweetId).length;
  }

  nuevoRT = { id_usuario: 0, id_tweet: 0 };


  rtTweet(tweetId: number) {
    const userId = parseInt(localStorage.getItem('idPerfil') ?? '0', 10);
    const existingRT = this.rts.find(rt => rt.tweet.id === tweetId && rt.usuario.id === userId);

    if (existingRT) {
      // Si ya existe un like, eliminarlo
      this.unrtTweet(existingRT.id);
    } else {
      // Si no existe un like, crear uno nuevo
      this.nuevoRT.id_tweet = tweetId;
      this.nuevoRT.id_usuario = userId;

      this.tweetService.crearRT(this.nuevoRT).subscribe(data => {
        this.obtenerRTs();
        this.crearNotificacion('retweet', tweetId);

      });
    }
  }

  unrtTweet(rtId: number) {
    this.tweetService.eliminarRT(rtId).subscribe(data => {
      this.obtenerRTs();
    });
  }

  checkIfRTd(tweetId: number): boolean {
    const userId = parseInt(localStorage.getItem('idPerfil') ?? '0', 10);
    return this.rts.some(rt => rt.tweet.id === tweetId && rt.usuario.id === userId);
  }


  esPropietario(tweet: any): boolean {
    const userId = parseInt(localStorage.getItem('idPerfil') ?? '0', 10);
    return tweet.usuario.id === userId;
  }

  eliminarTweet(tweetId: number) {
    this.tweetService.eliminarTweet(tweetId).subscribe(
      () => {
        this.tweets = this.tweets.filter(tweet => tweet.id !== tweetId);
      },
      error => {
        console.error('Error al eliminar el tweet', error);
      }
    );
  }

  // Función para verificar si el usuario es propietario de la respuesta
  esPropietarioRespuesta(respuesta: any): boolean {
    const userId = parseInt(localStorage.getItem('idPerfil') ?? '0', 10);
    return respuesta.usuario.id === userId;
  }


  // Función para eliminar una respuesta
  eliminarRespuesta(respuestaId: number) {
    this.tweetService.eliminarRespuestas(respuestaId).subscribe(
      () => {
        this.respuestas = this.respuestas.filter(respuesta => respuesta.id !== respuestaId);
      },
      error => {
        console.error('Error al eliminar la respuesta', error);
      }
    );
  }



  crearNotificacion(tipo: string, idTweet: number) {
    const userId = parseInt(localStorage.getItem('idPerfil') ?? '0', 10);
    const tweet = this.tweets.find(t => t.id === idTweet);

    if (tweet && tweet.usuario.id !== userId) { // Verificación para no enviar notificación a uno mismo
      const notificacion = {
        id_usuarioEm: userId,
        id_usuarioRe: tweet.usuario.id,
        tipoNotificacion: tipo,
        visto: false
      };

      this.usuarioService.crearNotificaciones(notificacion).subscribe(
        (response: any) => {
          console.log('Notificación creada:', response);
        },
        error => {
          console.error('Error al crear la notificación', error);
        }
      );
    }
  }





}
