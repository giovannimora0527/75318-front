/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutorService } from './service/autor.service';
import { Autor } from 'src/app/models/autor';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
// Importa los objetos necesarios de Bootstrap
declare const bootstrap: any;

@Component({
  selector: 'app-autor',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.scss'
})
export class AutorComponent {
  autores: Autor[] = [];
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';

  autorSelected: Autor;

  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    correo: new FormControl(''),
    telefono: new FormControl('')
  });

  constructor(
    private autorService: AutorService,
    private formBuilder: FormBuilder
  ) {
    this.cargarListaAutores();
    this.cargarFormulario();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      nacionalidad: ['', [Validators.required, Validators.email]],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarListaAutores() {
    this.autorService.getAutor().subscribe({
      next: (data) => {
        this.autores = data;
      },
      error: (error) => {
        Swal.fire('Error', error.error.message, 'error');
      }
    });
  }

  crearAutorModal(modoForm: string) {
    this.titleModal = modoForm == 'A' ? 'Agregar Autor' : 'Editar Autor';
    this.modoFormulario = modoForm;
    const modalElement = document.getElementById('crearAutorModal');     
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    }
  }

  cerrarModal() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
      nombre: '',
      nacionalidad: '',
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  abrirModoEdicion(autor: Autor) {
    this.autorSelected = autor;
    this.crearAutorModal('X');
  }

  guardarActualizarAutor() {
    console.log(this.form.valid);
    if (this.form.valid) {    
      if (this.modoFormulario.includes('A')) {       
        this.autorService.guardarAutorNuevo(this.form.getRawValue()).subscribe(
          {
            next: (data) => {
              console.log(data);
              this.showMessage("Éxito", data.message, "success");
              this.cargarListaAutores();
              this.cerrarModal();                            
            },
            error: (error) => {
              console.log(error);
              this.showMessage("Error", error.error.message, "error");
            }
          }
        );
      } else {
        const idAutor = this.autorSelected.idAutor;
        // Actualizar solo los campos específicos
        this.autorSelected = {
          ...this.autorSelected, // Mantener los valores anteriores
          ...this.form.getRawValue() // Sobrescribir con los valores del formulario
        };
        this.autorSelected.idAutor = idAutor;
        console.log(this.autorSelected);
        // Actualizamos el autor
        this.autorService.actualizarAutor(this.autorSelected).subscribe(
          {
            next: (data) => {
              this.showMessage("Éxito", "Se ha actualizado el autor satisfactoriamente", "success");
              console.log(data);
            },
            error: (error) => {
              console.log(error.error.message);
              this.showMessage("Error", error.error.message, "error");
            }
          }
        );
      }
    }
  }

  public showMessage(title: string, text: string, icon: SweetAlertIcon) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: 'Aceptar',      
      customClass: {
        container: 'position-fixed',
        popup: 'swal-overlay'
      },
      didOpen: () => {
        const swalPopup = document.querySelector('.swal2-popup');
        if (swalPopup) {
          (swalPopup as HTMLElement).style.zIndex = '1060';
        }
      }
    });
  }
}
