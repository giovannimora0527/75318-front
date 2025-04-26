/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageUtils } from 'src/app/utils/message-utils';
import { Libro } from 'src/app/models/libro';
import { FormGroup, FormControl, FormBuilder, FormsModule, ReactiveFormsModule, AbstractControl, Validators } from '@angular/forms';
import { LibroService } from './service/libro.service';
import { AutorService } from '../autor/service/autor.service';
import { Autor } from 'src/app/models/autor';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Categoria } from 'src/app/models/categoria';
// Importa los objetos necesarios de Bootstrap
declare const bootstrap: any;

@Component({
  selector: 'app-libro',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './libro.component.html',
  styleUrl: './libro.component.scss'
})
export class LibroComponent {
  modalInstance: any;
  titleModal: string = '';
  modoFormulario: string = '';
  libros: Libro[] = [];
  autores: Autor[] = [];
  categorias: Categoria[] = [];
  libroSelected: Libro;

  form: FormGroup = new FormGroup({
    titulo: new FormControl(''),
    anioPublicacion: new FormControl(''),
    autorId: new FormControl(''),
    categoriaId: new FormControl(''),
    existencias: new FormControl('')
  });

  constructor(
    private  messageUtils: MessageUtils,
    private  formBuilder: FormBuilder,
    private  libroService: LibroService,
    private  autorService: AutorService,
    private  categoriaService: CategoriaService
  ) {
    this.cargarLibros();
    this.cargarFormulario();
    this.cargarAutores();
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.categoriaService.getCategorias().subscribe(
      {
        next: (data) => {
          console.log(data);
          this.categorias = data;
        },
        error: (error) => {
          console.log(error);
        }
      }
    );
  }

  cargarAutores() {
    this.autorService.getAutor().subscribe(
      {
        next: (data) => {
          console.log(data);
          this.autores = data;
        },
        error: (error) => {
          console.log(error)
        }
      }
    );
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      titulo: ['', [Validators.required]],
      anioPublicacion: ['', [Validators.required]],
      autorId: ['', [Validators.required]],
      categoriaId: ['', [Validators.required]],
      existencias: ['', [Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarLibros() {
    this.libroService.getLibros().subscribe({
      next: (data) => {       
        this.libros = data;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  crearModal(modoForm: string) {
    this.modoFormulario = modoForm;
    const modalElement = document.getElementById('crearModal');
    modalElement.blur();
    modalElement.setAttribute('aria-hidden', 'false');
    this.titleModal = modoForm == 'C' ? 'Crear Libro' : 'Actualizar Libro';
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    }
    
  }

  abrirModoEdicion(libro: Libro) {
    this.libroSelected = libro;
    this.form.patchValue({
      titulo: this.libroSelected.titulo,
      existencias: this.libroSelected.existencias,
      categoriaId: this.libroSelected?.categoria?.categoriaId,
      anioPublicacion: this.libroSelected.anioPublicacion,
      autorId: this.libroSelected?.autor?.autorId
    });   
   
    this.crearModal('E');
   
  }

  cerrarModal() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
      titulo: '',
      anioPublicacion: '',
      exitencias: '',
      autorId: '',
      categoriaId: ''
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.libroSelected = null;
  }


  guardarActualizar() {
    console.log(this.form.getRawValue());
    if (this.form.valid) {
      if (this.modoFormulario === 'C') {
        console.log("Crear");
        this.libroService.crearLibro(this.form.getRawValue())
          .subscribe(
            {
              next: (data) => {
                console.log(data.message);
                this.cerrarModal();
                this.cargarLibros();
                this.messageUtils.showMessage("Éxito", data.message, "success");
              },
              error: (error) => {
                console.log(error);
                this.messageUtils.showMessage("Error", error.error.message, "error")
              }
            }
          );
      } else 
        console.log("Actualizar");        
        const libroActualizado: Libro = {
          idLibro: this.libroSelected.idLibro,
          titulo: this.form.get('titulo').value,
          anioPublicacion: this.form.get('anioPublicacion').value,
          existencias: this.form.get('existencias').value,
          autor: { autorId: parseInt(this.form.get('autorId').value, 10) } as Autor, // Casting a Autor
          categoria: { categoriaId: parseInt(this.form.get('categoriaId').value, 10) } as Categoria // Casting a Categoria
        };
        
        this.libroService.actualizarLibro(libroActualizado)
          .subscribe({
            next: (data) => {
              console.log(data.message);
              this.cerrarModal();
              this.cargarLibros();
              this.messageUtils.showMessage("Éxito", data.message, "success");
            },
            error: (error) => {
              console.log(error);
              this.messageUtils.showMessage("Error", error.error.message, "error");
            }
          });
      }
    }   
}