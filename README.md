# contratempo

**This is a work in progress.**

This webapp [will] have just one reason to exist: to create progressive counters, in the best style of safety signs.

![](http://www.safetysign.com/images/catlog/product/large/R4952.png)

Yep! So you could say, for example: 
- We are _80_ days without _losing my job_. 
- We are _50_ days without _a coup d'etat_. ---> For those who are against Temer and the new brazilian government.
- We are _50_ days without _PT in the government_. ---> For those who are against PT brazilian party.

And the counter will keep increasing until the time you reset it. 
And it will be published as a public page, so you could share it with your friends - or enemies!

# architecture
This webapp is designed to have its front end completely apart from the back end, for modular and maintenence reasons. 
It uses the **MEAN (Mongodb, Express, Angular and Node)** stack, so all of the project is written in **JavaScript**.

# current state of the project
This project already have a designed API, but it still needs time to get maturity. 
If you look into the code, you will realize there are several security flaws - they will be threated before the release. 
I am working everyday on this project, so it's expected to be launched very soon.   

# api
You can already test the API using this address: http://mate.tecepe.eng.br:8080/api/

I tried to make the API as dry as possible, to improve it maintenence, because we know it always get bigger than planned.
I followed some tips from this [best practices for designing a pragmatic API](http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api).
All the end points below are already working (but not ready for production).

| Verb    | URI                                              | Description                                            | Need to be signed? |
| ------- | ------------------------------------------------ | ------------------------------------------------------ | ------------------ |
| GET     | /api                                             | It will hold the API documentation                     | N                  |
| POST    | /token                                           | Get a new token, aka: 'sign in'                        | N                  |
| PUT     | /token                                           | Refresh the token                                      | Y                  |
| DELETE  | /token                                           | Delete the current token                               | Y                  |
| DELETE  | /tokens                                          | Delete all user tokens (logout from all devices)       | Y                  |
|         |                                                  |                                                        |                    |
| GET     |/api/users                                        | Get all users. Accepts queries param                   | N                  |
| POST    | /api/users                                       | Create a new user, aka: 'sign up'                      | N                  |
| PUT     | /api/users                                       | Edit the current logged user                           | Y                  |
| DELETE  | /api/users                                       | Remove the current logged user                         | Y                  |
| GET     | /api/users/:userSlug                             | Get a user according to its slug                       | N                  |
|         |                                                  |                                                        |                    |
| GET     | /api/users/all/counters                          | Get all counters from all users. Accepts queries param | N                  |
| GET     | /api/users/:userSlug/counters                    | Get all counters from an user. Accepts queries param   | N                  |
| POST    | /api/users/:userSlug/counters                    | Create a new counter                                   | Y                  |
| GET     | /api/users/:userSlug/counters/:counterSlug       | Get a counter according to the slugs                   | N                  |
| PUT     | /api/users/:userSlug/counters/:counterSlug       | Edit a counter according to its slugs                  | Y                  |
| DELETE  | /api/users/:userSlug/counters/:counterSlug       | Remove a counter according to its slugs                | Y                  |
|         |                                                  |                                                        |                    |
| PUT     | /api/users/:userSlug/counters/:counterSlug/star' | Add one star to the counter                            | Y                  |
| DELETE  | /api/users/:userSlug/counters/:counterSlug/star' | Remove one star from the counter                       | Y                  |

# building
In order to build the webapp, you will need to install some dependencies:

## back end
1. Run ```npm install```.
2. You will need to create a config.js file in the project root. It should look like this:

```javascript
module.exports = {
    'jwtSecret': 'yourSecret',
    'db': 'mongodb://your:mongo@db:1234/database'
};
```
## front end
The front end was scaffolded with **Yeoman Angular Generator** and uses **Grunt** as its task manager. To get it up and running, you will need:
1. Run ```npm install```.
2. Run ```bower install```.

To serve, run ```grunt serve```. To build, run just ```grunt```.

# found some dangerous flaw?
Please let me know!
