/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Autor } from 'src/app/models/autor';
import { AutorService } from './service/autor.service';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MessageUtils } from 'src/app/utils/message-utils';
import { Nacionalidad } from 'src/app/models/nacionalidad';
import { NacionalidadService } from 'src/app/services/nacionalidad.service';
// Importa los objetos necesarios de Bootstrap
declare const bootstrap: any;

@Component({
  selector: 'app-autor',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.scss'
})
export class AutorComponent {
  modalInstance: any;
  titleModal: string = '';
  modoFormulario: string = '';
  autores: Autor[] = [];
  nacionalidad: Nacionalidad[] = [];
  autorSelected: Autor;

  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    nacionalidadId: new FormControl(''),
    fechaNacimiento: new FormControl('')
  });

  constructor(
    private autorService: AutorService,
    private formBuilder: FormBuilder,
    private messageUtils: MessageUtils,
    private nacionalidadService: NacionalidadService

  ) {
    this.cargarListaAutor();
    this.cargarFormulario();
    this.cargarNacionalidad();
  }

  cargarNacionalidad() {
    this.nacionalidadService.getNacionalidad().subscribe(
      {
        next: (data) => {
          console.log(data);
          this.nacionalidad = data;
        },
        error: (error) => {
          console.log(error);
        }
      }
    );
  }

  cargarListaAutor() {
    this.autorService.getAutor().subscribe({
      next: (data) => {
        console.log(data);
        this.autores = data;
      },
      error: (error) => {
        this.messageUtils.showMessage('Error', error.error.message, 'error');
      }
    });
  }


  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      nacionalidadId: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  crearAutorModal(modoForm: string) {
    this.modoFormulario = modoForm;
    const modalElement = document.getElementById('crearAutorModal');
    modalElement.blur();
    modalElement.setAttribute('aria-hidden', 'false');
    this.titleModal = modoForm == "C"? "Crear Autor": "Actualizar Autor";
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    }

  }
  
  abrirModoEdicion(autor: Autor) {
    this.autorSelected = autor;
    this.form.patchValue({
      nombre: this.autorSelected.nombre,
      nacionalidadId: this.autorSelected.nacionalidad.nacionalidadId,
      fechaNacimiento: this.autorSelected.fechaNacimiento
    });
    console.log(this.form);
    console.log(this.autorSelected);
    this.crearAutorModal('E');
    console.log(this.autorSelected);
  }

  cerrarModal() { 
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
      nombre: "",
      nacionalidadId: "",
      fechaNacimiento: ""
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.autorSelected = null;
  }
  
  guardarActualizar() {
  

  if (this.form.valid) {
    if (this.modoFormulario === 'C') {
      console.log("Crear");
      console.log(this.form.getRawValue());     
      this.autorService.crearAutor(this.form.getRawValue()).subscribe({
        next: (data) => {
          console.log(data.message);
          this.cerrarModal();
          this.cargarListaAutor();
          this.messageUtils.showMessage("Éxito", data.message, "success");
        },
        error: (error) => {
          console.log(error);
          this.messageUtils.showMessage("Error", error.error.message, "error");
        }
      });
    } else {
      console.log("Actualizar");
      const idAutor = this.autorSelected.autorId;
      const nacionalidadIdValue = this.form.get('nacionalidadId').value;
      const selectedNacionalidad = this.nacionalidad.find(
        (n) => n.nacionalidadId === parseInt(nacionalidadIdValue, 10)
      );
      
      this.autorSelected = { 
        autorId: idAutor,
        nombre: this.form.get('nombre').value,
        fechaNacimiento: this.form.get('fechaNacimiento').value,
        nacionalidad: { nacionalidadId: parseInt(nacionalidadIdValue, 10), nombre: selectedNacionalidad ? selectedNacionalidad.nombre : '' }
      };     
      this.autorService.actualizarAutor(this.autorSelected).subscribe({
        next: (data) => {
          console.log(data.message);
          this.cerrarModal();
          this.cargarListaAutor();
          this.messageUtils.showMessage("Éxito", data.message, "success");
        },
        error: (error) => {
          console.log(error);
          this.messageUtils.showMessage("Error", error.error.message, "error");
        }
      });
    }
  } else {
    this.messageUtils.showMessage("Advertencia", "El formulario no es válido", "warning");
  }
}

}