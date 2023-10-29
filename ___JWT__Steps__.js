/***
 * *** PHASE ONE ***
 * 1. install jwt
 * 2. require jwt
 * 3. jwt.sign( payload, secret, options/callback { expireIn: "1h" } )
 * 4. genarate secret -- node -- require("crypto").randomBytes(64).toString("HEX")
 * 5. store secret to .env file and replace the secret word with process.env.namefrom.envfile in the jwt.sign
 * 6. send token to the client side
 */

/**
 *  ---- HOW TO STORE TOKEN TO THE CLIENT SIDE -----
 *
 * 1. Memory --> Ok type
 * 2. Local storage --> Ok type ( XSS - Cross site scripting )
 * 3. HTTP only cookie --> BEST
 *
 *
 * //////////////
 *
 * 1. install express cookie parser
 * 2. reqire cookie parser
 * 3. app.use(cookieParser())
 *
 */

/**
 *
 * *** PHASE TWO ***
 * res.cookie ( name(string), value, options/settings )
 * Set cookie with httpOnly: true, secure: false, sameSite: "none", maxAge: oneDay, //const oneDay = 24 * 60 * 60 * 1000;
 *
 * ------ Er por o cookie te set hobe na but tmi jodi last jwt er networ request ta dekho sekhane headers er moddhe token ta dekhte paba------
 *
 *
 * *** PHASE THREE ***
 *
 *  1. cors settings
 * app.use(
	cors({
		origin: ["http://localhost:5173", "http://localhost:5174"],
		credentials: true,
	})
);

 * 2. Get token from client side ====  Axios a optons er moddhe amra { withCredential: true }
   3. Sen token to the server side =====  Axios a optons er moddhe amra { withCredential: true }
 *
 */

/**
 *
 * ||||||||||| Verify TOken Middlewarae |||||||||||||
 *
 * 
 * 1. create a middleware with name and a async  function with three paramete called req,res,next
 * 
 * 
 * |||| PHASE ONE |||| >>>>>> Check token ace na nai??????
 * 
 * 1. get the stored token from client side by req.cookies?.token
 * *** use optional chaning that help you to run code without error. Use the givern name in the cookie in client side.
 * 2. if there is no token return and send a message to the user with status code. if there is token then go to the PHASE TWO
 * 
 * |||| PHASE TWO |||| >>>>> token thakle seta varify korte hobe and user info ta pathate hobe
 * 
 * 1. jwt.verify( token, secret, ( err, decoded ) => {
 * 
 * 	2. if(err){
 * 		return a message to the user with a status code
 * }
 * 
 * 	3. if not error that mean it now in decoded phase with a valid token. send the user info from the decoded for further verification
 * 
 * 	req.user = decoded
//  * 	Don't forget to use next()
 * } )
 * 
 * 
 *||||| PHASE THREE ||||| >>>>>>> decoded theke paoa user er info cross check kore dekhte hobe current data request kora user er info er sathe
 *
 *  jate rahim mia er token diye karim mia informaion na niye jete pare
 * 
 *  $$$$ Jokhon kono uesr data request kore tar email ta amra decoded theke paoa email er sathe cross check kore dekhbo
 * 	 Cross check decoded user email and qurey email that request data
	if (req.query.email !== req.user.email) {
		return res.status(403).send({ message: "Forbiden" });
	}
 * 

 *
 */
