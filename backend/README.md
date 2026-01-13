# AI Virtual Teacher Backend

An intelligent backend service that converts educational PDFs into personalized daily lessons using AI. This FastAPI-based application analyzes textbooks, generates study schedules, and creates customized learning content powered by LLMs.

## 🎯 Features

- **PDF Upload & Processing**: Upload PDF textbooks and automatically extract table of contents and content
- **AI-Powered Study Scheduling**: Generate optimized study schedules based on number of days
- **Dynamic Content Generation**: Create daily lesson content tailored to specific topics and subtopics
- **User Authentication**: Secure registration and login with JWT token-based authentication
- **Cloud Storage**: Integrate with Cloudinary for reliable PDF storage
- **Content Caching**: Intelligent caching to avoid redundant AI processing
- **Multi-Model LLM Support**: Works with Google Generative AI and Groq APIs
- **MongoDB Integration**: Persistent data storage for users, schedules, and generated content

## 🏗️ Project Structure

```
backend/
├── main.py                  # FastAPI application entry point
├── requirements.txt         # Python dependencies
├── core/                    # Core configuration and LLM setup
│   ├── config.py           # Settings management with Pydantic
│   └── llm.py              # LLM initialization and prompts
├── db/                      # Database configuration
│   ├── config.py           # MongoDB connection
│   └── cloudinary.py       # Cloudinary integration
├── middleware/              # Request/response middleware
│   └── authMiddleware.py    # JWT authentication middleware
├── models/                  # Pydantic data models
│   ├── Common.py           # Common response models
│   ├── Content.py          # Content-related models
│   ├── Pdf.py              # PDF processing models
│   ├── Study.py            # Study schedule models
│   └── User.py             # User authentication models
├── routes/                  # API endpoint routes
│   ├── auth.py             # Authentication endpoints
│   ├── content.py          # Content generation endpoints
│   └── pdf.py              # PDF processing endpoints
├── services/                # Business logic
│   ├── authService.py      # User registration and login
│   ├── content_generator.py # AI content generation
│   ├── pdf_loader.py       # PDF extraction and processing
│   └── study_scheduler.py  # Study schedule generation
├── utils/                   # Utility functions
│   ├── file_hash.py        # MD5 file hashing
│   ├── hashing.py          # Password hashing
│   ├── jwt_token.py        # JWT token creation/verification
│   └── text_splitter.py    # Text chunking for LLM processing
└── data/                    # Data storage
    ├── uploads/            # Temporary PDF uploads
    └── saved_content/      # Generated lesson content
```

## 🚀 Getting Started

### Prerequisites

- Python 3.13 or higher
- MongoDB instance (local or cloud)
- API keys for LLM providers (Google Generative AI or Groq)
- Cloudinary account for PDF storage

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv myenv
   # On Windows
   myenv\Scripts\activate
   # On macOS/Linux
   source myenv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create `.env` file** in the root directory
   ```env
   # LLM Configuration
   GOOGLE_API_KEY=your_google_api_key
   GROQ_API_KEY=your_groq_api_key

   # Database
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/
   DB_NAME=ai_teacher_db

   # Authentication
   JWT_SECRET=your_secret_key_here
   JWT_ALGORITHM=HS256

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Environment
   ENV=development
   ```

5. **Start the server**
   ```bash
   uvicorn main:app --reload
   ```

The API will be available at `http://localhost:8000`

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user and receive JWT token |
| POST | `/api/auth/logout` | Logout user |

**Register Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Login Request:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Study Plan

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/study/upload-and-schedule` | Upload PDF and generate study schedule |

**Request:**
```
POST /api/study/upload-and-schedule?days=30
Content-Type: multipart/form-data

file: <PDF file>
days: 30
```

**Response:**
```json
{
  "status": "success",
  "book_id": "b151dc02424b241b86bf2abfa6551cc4",
  "days": 30,
  "schedule": [
    {
      "day": 1,
      "chapter": "Chapter 1",
      "topics": ["Topic 1", "Topic 2"],
      "page_range": "1-15"
    }
  ],
  "total_pages": 250
}
```

### Content Generation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/content/generate` | Generate lesson content for specific day and topic |

**Request:**
```json
{
  "book_id": "b151dc02424b241b86bf2abfa6551cc4",
  "day_number": 1,
  "topic_index": 0,
  "subtopic_index": 0
}
```

**Response:**
```json
{
  "status": "success",
  "day_number": 1,
  "topic_index": 0,
  "chapter": "Chapter 1: Introduction",
  "topic": "Basic Concepts",
  "content": "Comprehensive lesson content...",
  "page_range": "1-15",
  "cached": false
}
```

## 🔐 Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in request headers:

```bash
Authorization: Bearer <your_jwt_token>
```

Protected endpoints require valid JWT tokens. Tokens are issued upon successful login and expire after a configured duration.

## 🛠️ Technology Stack

- **Framework**: FastAPI
- **Server**: Uvicorn
- **Database**: MongoDB
- **Authentication**: JWT with Passlib (Argon2)
- **LLM Integration**: LangChain with Google Generative AI and Groq
- **PDF Processing**: PyMuPDF, PyPDF
- **File Storage**: Cloudinary
- **Email Validation**: email-validator
- **Configuration**: Pydantic Settings

## 📦 Dependencies

Core dependencies (see `requirements.txt` for complete list):
- fastapi - Web framework
- uvicorn - ASGI server
- pymongo - MongoDB driver
- langchain - LLM orchestration
- langchain-google-genai - Google AI integration
- langchain-groq - Groq AI integration
- pymupdf - PDF processing
- passlib[argon2] - Password hashing
- pyjwt - JWT token handling
- python-dotenv - Environment variables

## 🔧 Configuration

All configuration is managed through environment variables in the `.env` file. Key settings:

- **LLM Providers**: Choose between Google Generative AI and Groq for content generation
- **Database**: Configure MongoDB connection string and database name
- **Security**: Set JWT secret and algorithm for token signing
- **Storage**: Configure Cloudinary credentials for PDF hosting
- **Environment**: Set to development or production

## 📝 Usage Example

1. **Register User**
   ```bash
   curl -X POST "http://localhost:8000/api/auth/register" \
     -H "Content-Type: application/json" \
     -d '{
       "username": "john_doe",
       "email": "john@example.com",
       "password": "securepass"
     }'
   ```

2. **Login**
   ```bash
   curl -X POST "http://localhost:8000/api/auth/login" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "john@example.com",
       "password": "securepass"
     }'
   ```

3. **Upload PDF & Generate Schedule**
   ```bash
   curl -X POST "http://localhost:8000/api/study/upload-and-schedule?days=30" \
     -H "Authorization: Bearer <your_token>" \
     -F "file=@textbook.pdf"
   ```

4. **Generate Content for a Day**
   ```bash
   curl -X POST "http://localhost:8000/api/content/generate" \
     -H "Authorization: Bearer <your_token>" \
     -H "Content-Type: application/json" \
     -d '{
       "book_id": "hash_value",
       "day_number": 1,
       "topic_index": 0,
       "subtopic_index": 0
     }'
   ```

## 💾 Data Storage

- **Uploaded PDFs**: Stored in Cloudinary for reliable cloud hosting
- **Study Schedules**: MongoDB collection storing generated schedules
- **Generated Content**: Cached in MongoDB to avoid redundant AI processing
- **User Profiles**: MongoDB storing user authentication data

## 🚨 Error Handling

API returns standard HTTP status codes:
- `200` - Success
- `400` - Bad request
- `401` - Unauthorized
- `404` - Not found
- `500` - Server error

Error responses include a detail message explaining the issue.

## 📄 License

This project is part of a major educational technology initiative.

## 🤝 Contributing

For contributions, please:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📧 Support

For issues or questions, please contact the development team or create an issue in the repository.

---

**Version**: 1.0.0  
**Status**: Active Development  
**Last Updated**: January 2026
