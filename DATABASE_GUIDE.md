# Database Setup Guide

## MongoDB Atlas Configuration

### 1. Create MongoDB Atlas Account
- Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free account
- Create a new cluster

### 2. Database Connection
Create a `.env` file in the backend directory with the following variables:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/foodwise
PORT=3001
NODE_ENV=development
```

### 3. Security Best Practices
- **NEVER** commit real database credentials to version control
- Use environment variables for all sensitive data
- Rotate credentials regularly
- Use strong passwords
- Enable IP whitelisting in MongoDB Atlas

### 4. Local Development
For local development, you can use:
```env
MONGODB_URI=mongodb://localhost:27017/foodwise
```

### 5. Production Deployment
- Use MongoDB Atlas production cluster
- Enable authentication
- Configure proper security settings
- Monitor database access logs

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  name: String,
  preferences: {
    dietary: [String],
    allergies: [String],
    healthGoals: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Recipes Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  ingredients: [String],
  instructions: [String],
  nutritionInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  tags: [String],
  cuisine: String,
  difficulty: String,
  prepTime: Number,
  cookTime: Number,
  servings: Number,
  createdAt: Date
}
```

### Restaurants Collection
```javascript
{
  _id: ObjectId,
  name: String,
  address: String,
  cuisine: String,
  rating: Number,
  priceRange: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  menu: [String],
  createdAt: Date
}
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
MONGODB_URI=your-mongodb-connection-string

# Server
PORT=3001
NODE_ENV=development

# API Keys (if needed)
OPENAI_API_KEY=your-openai-key
YELP_API_KEY=your-yelp-key
```

## Security Notes

⚠️ **IMPORTANT SECURITY REMINDERS:**

1. **Never commit `.env` files to version control**
2. **Use placeholder values in documentation**
3. **Rotate credentials if they are ever exposed**
4. **Use strong, unique passwords**
5. **Enable MongoDB Atlas security features**

## Troubleshooting

### Connection Issues
- Check your IP address is whitelisted in MongoDB Atlas
- Verify your connection string format
- Ensure your cluster is running
- Check your username and password

### Authentication Errors
- Verify your database user has proper permissions
- Check if your user is created in the correct database
- Ensure your password doesn't contain special characters that need encoding
