import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tweet } from '../modelos/tweet/tweet';
import { Respuestas } from '../modelos/respuestas/respuestas';
import { Likes } from '../modelos/likes/likes';
import { Rt } from '../modelos/rt/rt';

@Injectable({
  providedIn: 'root'
})
export class TweetService {
  private apiUrl = 'http://localhost:8000/api/tweets';
  private apiRespuestaUrl = 'http://localhost:8000/api/respuesta';
  private apiRTUrl = 'http://localhost:8000/api/rt';
  private apiLikesUrl = 'http://localhost:8000/api/likes';



  constructor(private http: HttpClient) { }

  obtenerTweets(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  crearTweets(data: Tweet): Observable<object> {
    return this.http.post<object>(this.apiUrl, data);
  }
  eliminarTweet(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }

  obtenerRespuestas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiRespuestaUrl);
  }
  crearRespuestas(data: Respuestas): Observable<object> {
    return this.http.post<object>(this.apiRespuestaUrl, data);
  }
  eliminarRespuestas(id: number): Observable<any> {
    const url = `${this.apiRespuestaUrl}/${id}`;
    return this.http.delete(url);
  }

  obtenerRT(): Observable<any[]> {
    return this.http.get<any[]>(this.apiRTUrl);
  }
  crearRT(data: Rt): Observable<object> {
    return this.http.post<object>(this.apiRTUrl, data);
  }
  eliminarRT(id: number): Observable<any> {
    const url = `${this.apiRTUrl}/${id}`;
    return this.http.delete(url);
  }

  obtenerLikes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiLikesUrl);
  }
  crearLikes(data: Likes): Observable<object> {
    return this.http.post<object>(this.apiLikesUrl, data);
  }
  eliminarLikes(id: number): Observable<any> {
    const url = `${this.apiLikesUrl}/${id}`;
    return this.http.delete(url);
  }

}
