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

 * 2. Axios a optons er moddhe amra { withCredential: true }
 *
 */
