import { ApiService } from '@/core/services/api.service';
import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService)
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    login: ['', Validators.required],
    mot_de_passe: ['', Validators.required],
    rememberMe: [false]
  });

  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }


  ngOnInit() {

    const savedLogin = localStorage.getItem('login');

    if (savedLogin) {
      this.loginForm.patchValue({
        login: savedLogin,
        rememberMe: true
      });
    }
  }

  messageErreur = signal('');
  isLoading = false;
  errorMessageLogin: string = '';
  errorMessagepassword: string = '';

  seConnecter() {
    const { login, rememberMe } = this.loginForm.value;

    this.errorMessageLogin = '';
    this.errorMessagepassword = '';
    if (this.loginForm.invalid) {
      console.warn('Veuillez renseigner tous les champs');
      this.messageErreur.set('verifie tous les champs');
      return;
    }


    const data = this.loginForm.value;
    this.isLoading = true;

    this.apiService.post('auth/login', data)
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.accessToken);
          localStorage.setItem('permissions', res.permissions);
          localStorage.setItem('user', JSON.stringify(res.user));
          console.log('connexion reussie :', res);

          if (rememberMe) {
            localStorage.setItem('login', login);
          } else {
            localStorage.removeItem('login');
          }
          this.isLoading = false;
          this.router.navigate(['/dashboard/overview']);
        },
        error: (err) => {
          console.error('Erreur de connexion :', err.error?.message || err.message);
          this.messageErreur.set(err.error?.message || 'Erreur de connexion');
          this.isLoading = false;
        }
      });

  }
}
