import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GraphqlService, Employee } from '../graphql.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];

  constructor(
    private graphqlService: GraphqlService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.graphqlService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: (error) => {
        console.error('There was an error retrieving employees!', error);
      }
    });
  }

  navigateToAddEmployee(): void {
    this.router.navigate(['/add-employee']);
  }

  viewEmployee(id: string): void {
    this.router.navigate([`/view-employee/${id}`]);
  }

  updateEmployee(id: string): void {
    this.router.navigate([`/update-employee/${id}`]);
  }

  deleteEmployee(id: string): void {
    this.graphqlService.deleteEmployeeById(id).subscribe({
      next: (_) => {
        this.loadEmployees(); // Refresh the list of employees
      },
      error: (error) => {
        console.error('Error deleting employee:', error);
      }
    });
  }
}