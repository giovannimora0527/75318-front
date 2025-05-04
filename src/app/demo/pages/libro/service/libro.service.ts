import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Libro } from 'src/app/models/libro';
import { RespuestaGenerica } from 'src/app/models/respuesta-gen';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private api = `libro`;

  constructor(private backendService: BackendService) {}

  getLibros(): Observable<Libro[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar")
  }

  crearLibro(libro: Libro): Observable<RespuestaGenerica> {
    return this.backendService.post(environment.apiUrl, this.api, "crear-libro", libro); 
  }

  actualizarLibro(libro: Libro) : Observable<RespuestaGenerica> {
    return this.backendService.post(environment.apiUrl, this.api, "actualizar-libro", libro);
  }

}