import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface AuthData {
  login: {
    token: string;
    user: {
      id: string;
      username: string;
    };
  };
}

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  salary: number;
}

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  constructor(private apollo: Apollo) {}

  login(username: string, password: string): Observable<AuthData> {
    return this.apollo.mutate<any>({
      mutation: gql`
        mutation Login($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            token
            user {
              id
              username
            }
          }
        }
      `,
      variables: {
        username,
        password,
      },
    }).pipe(
      map(result => result.data.login),
      catchError(error => {
        console.error('Error in login:', error);
        return throwError(error);
      })
    );
  }

  signup(username: string, email: string, password: string): Observable<AuthData> {
    return this.apollo.mutate<any>({
      mutation: gql`
        mutation Signup($username: String!, $email: String!, $password: String!) {
          signup(username: $username, email: $email, password: $password) {
            token
            user {
              id
              username
            }
          }
        }
      `,
      variables: {
        username,
        email,
        password,
      },
    }).pipe(
      map(result => result.data.signup),
      catchError(error => {
        console.error('Error in signup:', error);
        return throwError(error);
      })
    );
  }

  getAllEmployees(): Observable<Employee[]> {
    return this.apollo.watchQuery<{ getAllEmployees: Employee[] }>({
      query: gql`
        query GetAllEmployees {
          getAllEmployees {
            id
            first_name
            last_name
            email
            gender
            salary
          }
        }
      `,
    }).valueChanges.pipe(
      map(result => result.data.getAllEmployees),
      catchError(error => {
        console.error('Error fetching employees:', error);
        return throwError(error);
      })
    );
  }

  addNewEmployee(first_name: string, last_name: string, email: string, gender: string, salary: number): Observable<Employee> {
    return this.apollo.mutate({
      mutation: gql`
        mutation addNewEmployee($first_name: String!, $last_name: String!, $email: String!, $gender: String!, $salary: Float!) {
          addNewEmployee(first_name: $first_name, last_name: $last_name, email: $email, gender: $gender, salary: $salary) {
            id
            first_name
            last_name
            email
            gender
            salary
          }
        }
      `,
      variables: {
        first_name,
        last_name,
        email,
        gender,
        salary
      },
    }).pipe(map((result: any) => result.data.addNewEmployee));
  }

  updateEmployeeById(id: string, first_name: string, last_name: string, email: string, gender: string, salary: number): Observable<Employee> {
    return this.apollo.mutate({
      mutation: gql`
        mutation updateEmployeeById($id: ID!, $first_name: String!, $last_name: String!, $email: String!, $gender: String!, $salary: Float!) {
          updateEmployeeById(id: $id, first_name: $first_name, last_name: $last_name, email: $email, gender: $gender, salary: $salary) {
            id
            first_name
            last_name
            email
            gender
            salary
          }
        }
      `,
      variables: {
        id,
        first_name,
        last_name,
        email,
        gender,
        salary
      },
    }).pipe(map((result: any) => result.data.updateEmployeeById));
  }

  deleteEmployeeById(id: string): Observable<{ id: string }> {
    return this.apollo.mutate({
      mutation: gql`
        mutation deleteEmployeeById($id: ID!) {
          deleteEmployeeById(id: $id)
        }
      `,
      variables: { id },
    }).pipe(map((result: any) => result.data.deleteEmployeeById));
  }

  searchEmployeeById(id: string): Observable<Employee> {
    return this.apollo.query<{ searchEmployeeById: Employee }>({
      query: gql`
        query searchEmployeeById($id: ID!) {
          searchEmployeeById(id: $id) {
            id
            first_name
            last_name
            email
            gender
            salary
          }
        }
      `,
      variables: { id },
    }).pipe(map((result: any) => result.data.searchEmployeeById));
  }
}