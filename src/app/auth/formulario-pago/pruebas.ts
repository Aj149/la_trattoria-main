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
  
  constructor(
    private http: HttpClient,
    private authService: Authservice,
    private fb: FormBuilder
  ) {
    this.formulario = this.fb.group({
      fecha_reserva: ['', [
        Validators.required,
        this.formatoFechaValido()
      ]]
    });
  }

  formatoFechaValido(): ValidatorFn {
    return (control: AbstractControl) => {
      const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\/\d{4}$/;
      const esValido = regex.test(control.value);
      return esValido ? null : { formatoFechaInvalido: true };
    };
  }

  ngOnInit() {
    // Aquí puedes realizar acciones adicionales al iniciar el componente
  }
}
