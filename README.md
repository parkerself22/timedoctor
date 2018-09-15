# Timedoctor API

This is a basic library for interacting with the [Timedoctor REST API](https://webapi.timedoctor.com/doc#webandapp)

## Installation

```
npm i -s timedoctor
```

## Getting Started
```js
const {timedoctor, setup} = require("timedoctor");
```

### Get initial access and refresh token
#### Request Password Grant from TD
The workaround below is not the ideal way to handle this, if you email Timedoctor support and ask
for password grant access which will allow you to to get tokens via one GET call to:
```
https://webapi.timedoctor.com/oauth/v2/token?client_id=<CK>&client_secret=<CS>&grant_type=password&username=<EMAIL>&password=<PW>&consolidated=0
```

#### Workaround
A valid access and refresh token are required to initialize the package.
These can be generated using the setup function, which will run an express server
you can use to get the tokens.

You will need to have created a new Timedoctor app
and provided a redirect_url with an `/auth/timedoctor` endpoint.
(I suggest using [ngrok](https://ngrok.io) to tunnel locally)

```js
// no trailing slash
const redirect_url = "https://e147b7eb.ngrok.io";
setup(process.env.TD_CK, process.env.TD_CS, redirect_base);
```

Now visit `<your_redirect_url>`/login.
If everything goes well, you should be redirected to a page showing your access and refresh tokens.

Timedoctor regenerates refresh_tokens on each refresh so both will change once the package is used.

### Calling the API
You will need to provide functions for getting and setting the access and refresh tokens to
use the instance, which automatically handles refreshing tokens by passing them to the provided
`setTokens` function.

```js
const {timedoctor, setup} = require("timedoctor");
const tdApi = timedoctor(getTokens, setTokens, process.env.TD_COMPANY, process.env.TD_CK, process.env.TD_CS);
await tdApi.Users.getUser(user_id);
```
#### Example getTokens
```js
async getTokens() {
    if (this.access_token && this.refresh_token) {
        return {
            access_token: this.access_token,
            refresh_token: this.refresh_token
        }
    }
    const params = {
        'client_id': process.env.TD_CK,
        'client_secret': process.env.TD_CS,
        'grant_type': 'password',
        'username': process.env.TD_USER,
        'password': process.env.TD_PASSWORD,
        'consolidated': 0
    };
    let options = {
        method: 'GET',
        baseUrl: `https://webapi.timedoctor.com`,
        uri: '/oauth/v2/token',
        json: true,
        qs: params
    };
    let response = await request(options);
    this.refresh_token = response.refresh_token;
    this.access_token = response.access_token;
    return {
        access_token: response.access_token,
        refresh_token: response.refresh_token
    }
}
```

#### Response Format
All function calls return the following structure:
```ts
result = {
    error: boolean,
    errorMessage: null|string,
    response: any // Whatever data TD responds with (see below)
}
```

## Methods

### Absent & Late
#### Get a list of absent & late reasons, plus shifts (if applicable)
```js
const result = await tdApi.AbsentLate.get([params]);
result.response =  {
    "fullname": "Test",
    "schedules": [
      {
        "shiftStartsTs": 1533196800,
        "mustBeCompletedByTs": 1533234600,
        "minimumHours": "7h 30m",
        "minimumHoursSec": 27000,
        "actualStart": "08:00 AM",
        "hoursWorked": "10:29:26",
        "status": "Full Attendance",
        "futureStatus": "-",
        "reason": "",
        "reasonOther": "",
        "icon": "",
        "isFutureDate": 0,
        "isChecked": false,
        "isLate": false,
        "monitorLateStatus": 1,
        "actualEndTimeStamp": 1533234600,
        "actualEndTime": "6:30 PM",
        "actualStartAttendance": "8:00 AM",
        "shiftEndTime": "6:30 PM",
        "hoursWorkedInt": 10.490555555556,
        "secondsWorked": 37766,
        "currentShift": 0,
        "shiftStarts": "Thu, Aug 02, 08:00 AM",
        "shiftStartDate": "Aug 2, 2018",
        "shiftStartTime": "8:00 AM",
        "mustBeCompletedBy": "Thu, Aug 02, 06:30 PM",
        "shiftLength": "10h 30m",
        "shiftBreakTime": "<1m",
        "shiftBreakTimeInt": 0.0094444444444444,
        "fullName": "Test"
      }
  ]
}
```

#### Add reason(s) to the absent/late reasons list
```js
const reasons = ["was busy", "technical issues"];
tdApi.AbsentLate.put(reasons, [params]);
```

### Companies
All other calls to the TD api require a company_id, so you will need to either provide this or call
` tdApi.Companies.get(); ` and then set the company_id on the instance before making any more calls.

#### Get all companies the user has access to
```js
const result = await tdApi.Companies.get(),
    company_id = result.response.accounts[0].company_id
// data structure
result.response = {
  "user": {
    "full_name": "Test ",
    "first_name": "Test  ",
    "last_name": "",
    "email": "parker@test.com",
    "url": "https:\/\/webapi.timedoctor.com\/v1.1\/companies\/1234\/users\/1234",
    "user_id": 949833,
    "company_id": 413748,
    "level": "admin",
    "projects": null,
    "tasks": null,
    "work_status": null,
    "managed_users": null,
    "teams": null,
    "payroll_access": 1,
    "billing_access": true,
    "avatar": "https:\/\/s3.amazonaws.com\/tds3_avatars\/1234.jpg",
    "screenshots_active": "0",
    "manual_time": "1",
    "permanent_tasks": 1,
    "computer_time_popup": "540",
    "poor_time_popup": "-1",
    "blur_screenshots": 0,
    "web_and_app_monitoring": "1",
    "webcam_shots": 0,
    "screenshots_interval": "9",
    "user_role_value": null,
    "status": "active",
    "reports_hidden": null
  },
  "accounts": [
    {
      "user_id": 1234,
      "company_id": 1234,
      "type": "admin",
      "company_name": "test",
      "url": "https:\/\/webapi.timedoctor.com\/v1.1\/companies\/1234\/users\/1234",
      "company_time_zone_id": 17,
      "company_time_zone": "America\/New_York",
      "company_subdomain": "test",
      "company_logo": "https:\/\/s3.amazonaws.com\/tds3_avatars\/1234.jpg",
      "new_user": "0",
      "force_project": true,
      "managers_add_edit_projects": true
    }
  ]
}

```

#### Set the company_id for the instance
```js
tdApi.Companies.set(company_id);
```

### Users
#### Get a list of users, optionally filter by email
```js
const result = await tdApi.Users.getUsers(emails);
// data structure
result.response = {
                    "count": 1,
                    "url": "https:\/\/webapi.timedoctor.com\/v1.1\/companies\/1234\/users",
                    "users": [
                      {
                        "full_name": "Parker Self",
                        "first_name": "Parker  Self",
                        "last_name": "",
                        "email": "parker@test.com",
                        "url": "https:\/\/webapi.timedoctor.com\/v1.1\/companies\/1234\/users\/1234",
                        "user_id": 1234,
                        "company_id": 1,
                        "level": "admin",
                        "projects": {
                          "currently_assigned": {
                            "count": "156",
                            "url": "https:\/\/webapi.timedoctor.com\/v1.1\/companies\/1234\/users\/1234\/projects?all=0"
                          },
                          "all": {
                            "count": "739",
                            "url": "https:\/\/webapi.timedoctor.com\/v1.1\/companies\/1234\/users\/1234\/projects?all=1"
                          }
                        },
                        "tasks": {
                          "all": {
                            "count": 1935,
                            "url": "https:\/\/webapi.timedoctor.com\/v1.1\/companies\/1234\/users\/1234\/tasks?status=all"
                          },
                          "active": {
                            "count": 393,
                            "url": "https:\/\/webapi.timedoctor.com\/v1.1\/companies\/1234\/users\/1234\/tasks?status=active"
                          }
                        },
                        "work_status": {
                          "code": "offline",
                          "info": "Offline",
                          "current_task": null
                        },
                        "managed_users": [],
                        "teams": [],
                        "payroll_access": 1,
                        "billing_access": 1,
                        "avatar": "https:\/\/s3.amazonaws.com\/tds3_avatars\/1234.jpg",
                        "screenshots_active": "0",
                        "manual_time": "1",
                        "permanent_tasks": 1,
                        "computer_time_popup": "540",
                        "poor_time_popup": "-1",
                        "blur_screenshots": 0,
                        "web_and_app_monitoring": "1",
                        "webcam_shots": 0,
                        "screenshots_interval": "9",
                        "user_role_value": null,
                        "status": "active",
                        "reports_hidden": false
                      }
                    ]
                  }
```

#### Get a single user by ID
```js
let result = await tdApi.Users.getUser(user_id);
// result.response is an user object (see above)
```


### Worklogs
#### Get worklogs
```js
const start = new Date("8/10/2018");
const end = new Date();
tdApi.Worklogs.get(start, end, [params]);
```


