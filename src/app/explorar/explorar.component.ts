import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../service/usuario.service';

@Component({
  selector: 'app-explorar',
  templateUrl: './explorar.component.html',
  styleUrls: ['./explorar.component.css']
})
export class ExplorarComponent implements OnInit {
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  query: string = '';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioService.obtenerUsuario().subscribe(data => {
      this.usuarios = data;
      this.usuariosFiltrados = data;
    });
  }

  buscarUsuarios(): void {
    this.usuariosFiltrados = this.usuarios.filter(usuario =>
      usuario.nick.toLowerCase().includes(this.query.toLowerCase())
    );
  }
}
