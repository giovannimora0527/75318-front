import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Autor } from 'src/app/models/autor';
import { AutorRs } from 'src/app/models/autorRs';
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

  guardarAutorNuevo(autor: Autor) : Observable<AutorRs>  {    
    return this.backendService.post(environment.apiUrl, this.api, "guardar-autor", autor);
  }

  actualizarAutor(autor: Autor): Observable<Autor[]>  {    
    return this.backendService.post(environment.apiUrl, this.api, "actualizar-autor", autor);
  }

}