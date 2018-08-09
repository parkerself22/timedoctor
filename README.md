# Timedoctor API

This is a basic library for interacting with the [Timedoctor REST API](https://webapi.timedoctor.com/doc#webandapp) 

## Installation

``` 
npm i -s timedoctor 
```

## Getting Started
```
const {timedoctor, setup} = require("timedoctor");
```

### Get initial access and refresh token
A valid access and refresh token are required to initialize the package. 
These can be generated using the setup function, which will run an express server 
you can use to get the tokens. 

You will need to have created a new Timedoctor app
and provided a redirect_url with an `/auth/timedoctor` endpoint. 
(I suggest using [ngrok](https://ngrok.io) to tunnel locally)

```
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

```
const {timedoctor, setup} = require("timedoctor");
const tdApi = timedoctor(getTokens, setTokens, process.env.TD_COMPANY, process.env.TD_CK, process.env.TD_CS);
await tdApi.Users.getUser(user_id);
```

## Methods

### Companies
All other calls to the TD api require a company_id, so you will need to either provide this or call
` tdApi.Companies.get(); ` and then set the company_id on the instance before making any more calls.

#### Get all companies the user has access to
```
const response = await tdApi.Companies.get(),
    company_id = response.accounts[0].company_id
```

#### Set the company_id for the instance
```
tdApi.Companies.set(company_id);
```

### Users
#### Get a list of users, optionally filter by email
```
const response = await tdApi.Users.getUsers(emails);
```

#### Get a single user by ID
```
tdApi.Users.getUser(user_id);
```

### Absent & Late
#### Get a list of absent & late reasons, plus shifts (if applicable)
```
const response = await tdApi.AbsentLate.get([params]);
```

#### Add reason(s) to the absent/late reasons list 
```
const reasons = ["was busy", "technical issues"];
tdApi.AbsentLate.put(reasons, [params]);
```

### Worklogs
#### Get worklogs
```
const start = new Date("8/10/2018");
const end = new Date();
tdApi.Worklogs.get(start, end, [params]);
```


