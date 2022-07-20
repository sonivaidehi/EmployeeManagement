
# Employee Management

Manages employee and department informations


## Steps to run Locally

Clone the project

```bash
  git clone https://github.com/sonivaidehi/EmployeeManagement.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## Default User

### Admin credentials
**username** : admin <br/>
**email** : admin@gmail.com <br/>
**password**: admin@123<br/>


### Employee credentials
**username** : john_doe <br/>
**email** : john@gmail.com <br/>
**password**: user@123 <br/>



## APIs
- Register Admin 
- Register User
- Admin Login
- Employee Login
- Create Department
- Assign/reassign department to an Employee
- View assigned department details
- View co-workers


# API Reference
https://documenter.getpostman.com/view/21888420/UzQyrimq

## Admin APIs

<br/>

#### Admin Login

```http
  POST /admin/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | email or username of a user |
| `password` | `string` | password of a user |

<br/>

#### Create new admin user

```http
  POST /admin/create
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | username of a user |
| `name`      | `string` | name of a user |
| `email`      | `string` | email of a user |
| `phone`      | `string` | phone number of a user |
| `password`      | `string` | password of a user (optional) |


<br/>

#### Create a new department

```http
  POST /admin/department/create
```
JWT Required in Header
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | username of a user |
| `code`      | `string` | name of a user |
| `email`      | `string` | email of a user |


<br/>

#### Assign/reassign Department to employee

```http
  POST /admin/assign-department
```
JWT Required in Header
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `employeeUsername`      | `string` | username or email of an employee |
| `departmentCode`      | `string` | code of a department |

<br/>

## Employee APIs

<br/>

#### Employee Login

```http
  POST /employee/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | email or username of a user |
| `password` | `string` | password of a user |


<br/>

#### Create new employee user

```http
  POST /employee/create
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | username of a user |
| `name`      | `string` | name of a user |
| `email`      | `string` | email of a user |
| `phone`      | `string` | phone number of a user |
| `password`      | `string` | password of a user (optional) |


<br/>

#### Get information of assigned department

```http
  GET /employee/get-department/{{EmployeeId}}
```
JWT Required in Header


<br/>

#### Assign/reassign Department to employee

```http
  GET /employee/get-coworker/{{employeeId}}
```
JWT Required in Header


