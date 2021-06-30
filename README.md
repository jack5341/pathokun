![Pathokun Image](master/img/Pathokun.png)

# Pathokun 

Pathokun, a path generater, update your content just with your frontend by HTTP GET Request! In this way you can make Full-Stack project without any backend with any programming language.

## Working Principe

### **Add new path to account**
  
Pathokun is an solution for frontend developers. After you Sign in to Pathokun, can add new path or endpoint whatever is name. 

eg: 
 
```sh
curl --insecure -XPOST 
-H 'Bearer: Your Token'
-H "Content-type: application/json" 
-d '{"Endpoint": "invoiceprinter", "Content": "{   "sub": "dwqdwqdwqdwqdwqdwqdwqdwq",   "name": "John Doe",   "iat": 1516239022 }"}' 'localhost:4000/s/endpoint'
```

### **Generate a private token**

Whenever you want fetch your content by pathname, firstly have to generate an private access token from *`/s/privatetoken`* with your sign in token.Then **authorize.js** plugin will verify your token with your secret code, after authorize you can go foward to *`/s/privatetoken`*.  This path will generate a token and sign by your id from database and this token is must be **SUPER SECRET**.

eg:

```sh
curl -XGET 
-H 'Bearer: Your Token' 'localhost:4000/s/privatetoken'
```

> THIS GENERATED TOKEN IS MUST BE SECRET !!!

### **Fetch content from path**
So after you have generate a private token you can directly access your content by pathname.Just you have to put your private token to header with **bearer** and sending a GET Request. 

```sh
curl -XGET 
-H 'Bearer: Your Secret Token' 'localhost:4000/e/<your username>/<your pathname>'
```

## Database Schema **(Mongodb)**

### `users` collection

| _id | role | reset_token | email | username | password | date | _v |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| `ObjectId(id)` | `int` | `string` | `string` | `string` | `string` | `date` | `int` |

### `endpoints` collection

| _id | endpoint | user_id | date | _v | 
| :-- | :-- | :-- | :-- | :-- |
| `ObjectId(id)` | `array` | `string` | `string` | `string`

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Show your support

Give a ⭐️ if this project helped you! or buy me a 🍺
<a href="https://www.paypal.com/paypalme/nedimakar5341">Paypal</a>

## License
[Apache-2.0](https://choosealicense.com/licenses/apache-2.0/)