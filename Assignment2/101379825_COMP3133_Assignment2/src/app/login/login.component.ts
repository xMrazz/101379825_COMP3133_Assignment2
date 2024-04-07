import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GraphqlService } from '../graphql.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username!: string;
  password!: string;

  constructor(private graphqlService: GraphqlService, private router: Router) {}

  onSubmit(): void {
    this.graphqlService.login(this.username, this.password).subscribe({
      next: (data) => {
        localStorage.setItem('token', data.login.token);
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    });
  }
}