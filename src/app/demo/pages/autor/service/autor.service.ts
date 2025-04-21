import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaGenerica } from 'src/app/models/respuesta-gen';
import { Autor } from 'src/app/models/autor';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutorService {
  private api = `autor`;

  constructor(private backendService: BackendService) { 
    this.testService();
  }
  
  testService() {
    this.backendService.get(environment.apiUrl, this.api, "test");
  }

  getAutor(): Observable<Autor[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }
  
  crearAutor(autor: Autor): Observable<RespuestaGenerica> {
      return this.backendService.post(environment.apiUrl, this.api, "crear-autor", autor); 
  }

  actualizarAutor(autor: Autor) : Observable<RespuestaGenerica> {
    return this.backendService.post(environment.apiUrl, this.api, "actualizar-autor", autor);
  }
}
