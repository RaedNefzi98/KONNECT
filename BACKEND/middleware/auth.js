import jwt from "jsonwebtoken";

// Middleware function for verifying the JWT token
export const verifyToken = async (req, res, next) => {
  try {
    
     // Extract the token from the "Authorization" header
     let token = req.header('Authorization');

     // Check if the token exists in the header
     if (!token) {
       return res.status(403).send('Access Denied');
     }
 
     // Remove the "Bearer " prefix from the token, if it exists
     if (token.startsWith('Bearer ')) {
       token = token.slice(7, token.length).trimLeft();
     }
 
     // Verify the token using the provided JWT_SECRET from environment variables
     const verified = jwt.verify(token, process.env.JWT_SECRET);
 
     // If the token is valid, attach the decoded user information to the request object
     req.user = verified;
 
     // Call the next middleware in the chain
     next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};