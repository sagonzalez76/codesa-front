import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ApiResponse } from '../../shared/models/api-response.model';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

import { PersonService } from '../person.service';
import { Person } from '../person.model';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { KeyFilterModule } from 'primeng/keyfilter';

@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
    CalendarModule,
    KeyFilterModule
  ],
  providers: [ConfirmationService, MessageService],

  templateUrl: './person-list.component.html',
  styleUrl: './person-list.component.css'
})
export class PersonListComponent implements OnInit {
  persons: Person[] = [];
  totalRecords = 0;
  rows = 5;
  loading = false;

  sortField: string = 'nombre';
  sortOrder: number = 1;

  // Modal y formulario
  showDialog = false;
  editingPerson: Person | null = null;
  personForm: FormGroup;
  saving = false;

  maxDate: Date = new Date();
  minDate: Date = new Date(1900, 0, 1);


  constructor(
    private personService: PersonService,
    private router: Router,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.personForm = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      fechaNacimiento: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPersonsLazy({
      first: 0,
      rows: this.rows,
      sortField: this.sortField,
      sortOrder: this.sortOrder
    });
  }

  loadPersonsLazy(event: any) {
    this.loading = true;

    const page = event.first / event.rows;
    const size = event.rows;
    const sortField = event.sortField || 'nombre';
    const sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';

    this.sortField = sortField;
    this.sortOrder = event.sortOrder;

    this.personService.getAllPaginated(page, size, sortField, sortOrder)
      .subscribe({
        next: res => {
          this.persons = res.content;
          this.totalRecords = res.totalElements;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  createPerson() {
    this.editingPerson = null;
    this.personForm.reset();
    this.showDialog = true;
  }

  editPerson(id: number) {
    this.personService.getById(id).subscribe({
      next: (person) => {


        this.editingPerson = person;
        this.personForm.patchValue(person);
        this.showDialog = true;
      },
      error: err => {
        const errorMsg = err.error?.mensaje || 'Error al cargar persona';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMsg,
          life: 3000
        });
      }
    });
  }



  savePerson() {
    console.log(this.personForm.value);
    if (this.personForm.invalid) return;

    this.saving = true;
    const formValue = this.personForm.value;

    const handleSuccess = (msg: string) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: msg,
        life: 3000
      });
      this.loadPersonsLazy({ first: 0, rows: this.rows, sortField: this.sortField, sortOrder: this.sortOrder });
      this.showDialog = false;
      this.saving = false;
    };

    const handleError = (err: any, fallback: string) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: err.error?.mensaje || fallback,
        life: 3000
      });
      this.saving = false;
    };

    if (formValue.id) {
      this.personService.update(formValue.id, formValue).subscribe({
        next: () => handleSuccess('Persona actualizada correctamente'),
        error: (err) => handleError(err, 'Error al actualizar la persona')
      });
    } else {
      this.personService.create(formValue).subscribe({
        next: () => handleSuccess('Persona creada correctamente'),
        error: (err) => handleError(err, 'Error inesperado al crear persona')
      });
    }
  }



  deletePerson(id: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar esta persona?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.personService.delete(id).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Persona eliminada' });
          this.loadPersonsLazy({ first: 0, rows: this.rows, sortField: this.sortField, sortOrder: this.sortOrder });
        });
      }
    });
  }
}
