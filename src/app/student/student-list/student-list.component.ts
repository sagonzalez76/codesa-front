import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { StudentService } from '../student.service';
import { Student } from '../student.model';

import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { KeyFilterModule } from 'primeng/keyfilter';

@Component({
  selector: 'app-student-list',
  standalone: true,
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css',
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
  providers: [ConfirmationService, MessageService]
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  totalRecords = 0;
  rows = 5;
  loading = false;

  sortField = 'nombre';
  sortOrder = 1;

  showDialog = false;
  editingStudent: Student | null = null;
  studentForm: FormGroup;
  saving = false;

  maxDate: Date = new Date();
  minDate: Date = new Date(1900, 0, 1);

  constructor(
    private studentService: StudentService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.studentForm = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      numeroMatricula: ['', Validators.required],
      grado: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadStudentsLazy({
      first: 0,
      rows: this.rows,
      sortField: this.sortField,
      sortOrder: this.sortOrder
    });
  }

  loadStudentsLazy(event: any) {
    this.loading = true;
    const page = event.first / event.rows;
    const size = event.rows;
    const sortField = event.sortField || 'nombre';
    const sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';

    this.sortField = sortField;
    this.sortOrder = event.sortOrder;

    this.studentService.getAllPaginated(page, size, sortField, sortOrder).subscribe({
      next: res => {
        this.students = res.content;
        this.totalRecords = res.totalElements;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  createStudent() {
    this.editingStudent = null;
    this.studentForm.reset();
    this.showDialog = true;
  }

  editStudent(id: number) {
    this.studentService.getById(id).subscribe({
      next: student => {
        this.editingStudent = student;
        this.studentForm.patchValue(student);
        this.showDialog = true;
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.mensaje || 'Error al cargar estudiante',
          life: 3000
        });
      }
    });
  }

  saveStudent() {
    if (this.studentForm.invalid) return;

    this.saving = true;
    const formValue = this.studentForm.value;

    const handleSuccess = (msg: string) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: msg,
        life: 3000
      });
      this.loadStudentsLazy({ first: 0, rows: this.rows, sortField: this.sortField, sortOrder: this.sortOrder });
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
      this.studentService.update(formValue.id, formValue).subscribe({
        next: () => handleSuccess('Estudiante actualizado correctamente'),
        error: err => handleError(err, 'Error al actualizar el estudiante')
      });
    } else {
      this.studentService.create(formValue).subscribe({
        next: () => handleSuccess('Estudiante creado correctamente'),
        error: err => handleError(err, 'Error inesperado al crear estudiante')
      });
    }
  }

  deleteStudent(id: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este estudiante?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.studentService.delete(id).subscribe(() => {
          this.loadStudentsLazy({ first: 0, rows: this.rows, sortField: this.sortField, sortOrder: this.sortOrder });
        });
      }
    });
  }
}
