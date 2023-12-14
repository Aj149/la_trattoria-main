import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Authservice } from '../auth.service';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Ambiente } from '../interface/ambiente.interface';

@Component({
  selector: 'app-formulario-pago',
  templateUrl: './formulario-pago.component.html',
  styleUrls: ['./formulario-pago.component.css'],
})
export class FormularioPagoComponent implements OnInit {
  formulario: FormGroup;
  selectAmbiente: Ambiente[] = [];
  limiteSeleccionado: number = 0;
  ambiente: any;
  
  private fechaActual = new Date();

  constructor(
    private http: HttpClient,
    private authService: Authservice,
    private fb: FormBuilder
  ) 
  
  {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      numero_telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      cantidad_personas: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      ambiente: ['', [Validators.required]],
      fechaExpiracion: ['', [Validators.required, this.formatoFechaValido()]],
      cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      numeroTarjeta: ['',[Validators.required, Validators.pattern(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/)],],
      fecha_reserva: ['',[Validators.required,Validators.pattern(/^\d{2}\/\d{2}\/\d{4}$/),this.validarFecha,],],
      hora_reserva: ['', [Validators.required, this.validarhora_reserva]],
    });
  }

  ngOnInit() {
    this.obtenerAmbientes();
  }

  obtenerAmbientes() {
    this.http.get<Ambiente[]>('http://127.0.0.1:5000/app/ver/ambientes').subscribe(
      (data) => {
        this.selectAmbiente = data;
      },
      (error) => {
        console.error('Error al obtener ambientes:', error);
      }
    );
  }
  cambiarAmbiente(event: Event) {
    const target = event.target as HTMLSelectElement;
    const ambienteSeleccionado = target.value;
  
    this.http.get<any>(`http://127.0.0.1:5000/app/ver/capacidad/personas/${ambienteSeleccionado}`)
      .subscribe(data => {
        this.limiteSeleccionado = data.capacidad; // Asigna la capacidad del ambiente desde el backend
      }, error => {
        console.error(error);
      });
  }
  


  realizarPago() {
    const data = {
      nombre: this.formulario.get('nombre')?.value,
      apellido: this.formulario.get('apellido')?.value,
      correo: this.formulario.get('correo')?.value,
      numero_telefono: this.formulario.get('numero_telefono')?.value,
      cantidad_personas: this.formulario.get('cantidad_personas')?.value,
      ambiente: this.formulario.get('ambiente')?.value,
      cedula: this.formulario.get('cedula')?.value,
      fecha_reserva: this.formulario.get('fecha_reserva')?.value,
      hora_reserva: this.formulario.get('hora_reserva')?.value
    };

    this.authService.realizarPago(data)?.subscribe({
      next: (value: Object) => {
        console.log('Reserva exitosa', value);
      },
      error: (error: any) => {
        console.error('Error al realizar la reserva:', error);
      },
    });
  }


  validarFecha: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
    const fechaIngresada = new Date(control.value);
    
    // Verificar si la fecha ingresada es menor que la fecha actual
    if (fechaIngresada < this.fechaActual) {
      return { fechaInvalida: true };
    }
    
    return null;
  };


  validarhora_reserva(control: AbstractControl) {
    const hora_reservaRegex = /^(1[0-2]|0?[1-9]):[0-5][0-9] (am|pm)$/i;

    if (control.value && !hora_reservaRegex.test(control.value)) {
      return { formatoInvalido: true };
    }

    return null;
  }

  formatoFechaValido(): ValidatorFn {
    return (control: AbstractControl) => {
      const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      const esValido = regex.test(control.value);
      return esValido ? null : { formatoFechaInvalido: true };
    };
  }
  
  
}