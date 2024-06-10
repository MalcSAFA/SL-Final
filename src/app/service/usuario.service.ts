import { Injectable } from '@angular/core';
import { Usuario } from '../modelos/usuario/usuario';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Perfil } from '../modelos/perfil/perfil';
import { Notificaciones } from '../modelos/notificaciones/notificaciones';
import { Seguidores } from '../modelos/seguidores/seguidores';
import { Lista } from '../modelos/lista/lista';
import { UsuarioLista } from '../modelos/usuario-lista';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
  private apiUrl = 'http://localhost:8000/api/usuario';
  private apiRegistroUrl = 'http://localhost:8000/api/registro';
  private apiPerfilUrl = 'http://localhost:8000/api/perfil';
  private apiNotiUrl = 'http://localhost:8000/api/notificaciones';
  private apiSeguirUrl = 'http://localhost:8000/api/seguidores';
  private apiListaUrl = 'http://localhost:8000/api/lista';
  private apiUsuarioListaUrl = 'http://localhost:8000/api/usuario_lista';






  constructor(private http: HttpClient) { }


  obtenerUsuario(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  obtenerPerfil(): Observable<any> {
    return this.http.get<any>(this.apiPerfilUrl);
  }

  cambioPerfil(id: number, data: Perfil): Observable<object> {
    const url = `${this.apiPerfilUrl}/${id}`;
    return this.http.put<object>(url, data);
  }


  cambioUsuario(id: number, data: Usuario): Observable<object> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<object>(url, data);
  }


  crearUsuario(data: Usuario): Observable<object> {
    return this.http.post<object>(this.apiRegistroUrl, data);
  }


  obtenerNotificaciones(): Observable<any> {
    return this.http.get<any>(this.apiNotiUrl);
  }


  crearNotificaciones(data: Notificaciones): Observable<object> {
    return this.http.post<object>(this.apiNotiUrl, data);
  }

  obtenerSeguidores(): Observable<any> {
    return this.http.get<any>(this.apiSeguirUrl);
  }


  crearSeguidores(data: Seguidores): Observable<object> {
    return this.http.post<object>(this.apiSeguirUrl, data);
  }

  eliminarSeguidores(id: number): Observable<any> {
    const url = `${this.apiSeguirUrl}/${id}`;
    return this.http.delete(url);
  }

  obtenerListas(): Observable<any> {
    return this.http.get<any>(this.apiListaUrl);
  }


  crearListas(data: Lista): Observable<object> {
    return this.http.post<object>(this.apiListaUrl, data);
  }

  eliminarListas(id: number): Observable<any> {
    const url = `${this.apiListaUrl}/${id}`;
    return this.http.delete(url);
  }

  obtenerUsuarioListas(): Observable<any> {
    return this.http.get<any>(this.apiUsuarioListaUrl);
  }


  crearUsuarioListas(data: UsuarioLista): Observable<object> {
    return this.http.post<object>(this.apiUsuarioListaUrl, data);
  }

  eliminarUsuarioListas(id: number): Observable<any> {
    const url = `${this.apiUsuarioListaUrl}/${id}`;
    return this.http.delete(url);
  }



}
