import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GraphqlService } from '../graphql.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {  
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private graphqlService: GraphqlService,
    private router: Router
  ) {}

  onRegister() {
    this.graphqlService.signup(this.username, this.email, this.password).subscribe({
      next: (response) => {
        console.log('Signup successful', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    });
  }
}