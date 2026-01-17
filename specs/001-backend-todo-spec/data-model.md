# Data Model: Backend Todo Application

## Entity: User

### Fields
- `id` (UUID, Primary Key): Unique identifier for the user
- `email` (String, NOT NULL, UNIQUE): User's email address (used for login)
- `hashed_password` (String, NOT NULL): Bcrypt-hashed password
- `created_at` (DateTime, NOT NULL): Timestamp when user was created
- `updated_at` (DateTime, NOT NULL): Timestamp when user was last updated
- `is_active` (Boolean, NOT NULL, DEFAULT: True): Whether the user account is active

### Relationships
- `tasks` (One-to-Many): User has many tasks (via Task.user_id)

### Validation Rules
- Email must be valid email format (RFC 5322)
- Email must be unique across all users
- Email must be 1-255 characters
- Password must be at least 8 characters with uppercase, lowercase, and special character (before hashing)

## Entity: Task

### Fields
- `id` (UUID, Primary Key): Unique identifier for the task
- `title` (String, NOT NULL): Task title (1-100 characters)
- `description` (String, NULL): Optional task description (up to 1000 characters)
- `completed` (Boolean, NOT NULL, DEFAULT: False): Whether the task is completed
- `user_id` (UUID, NOT NULL, FOREIGN KEY): Reference to the owning user
- `created_at` (DateTime, NOT NULL): Timestamp when task was created
- `updated_at` (DateTime, NOT NULL): Timestamp when task was last updated
- `due_date` (DateTime, NULL): Optional deadline for the task

### Relationships
- `user` (Many-to-One): Task belongs to one user (via user_id foreign key)

### Validation Rules
- Title must be 1-100 characters
- Description can be up to 1000 characters (if provided)
- user_id must reference an existing active user
- Completed status can be toggled between true/false

## Database Schema

### Tables

#### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);
```

#### tasks
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
```

## State Transitions

### Task State Transitions
- **Incomplete → Completed**: When user marks task as done
- **Completed → Incomplete**: When user unmarks task as done

### User State Transitions
- **Active → Inactive**: When user account is deactivated (soft delete)
- **Inactive → Active**: When user account is reactivated

## Constraints

### Referential Integrity
- Foreign key constraint ensures tasks.user_id references valid users.id
- ON DELETE CASCADE removes tasks when user is deleted

### Data Integrity
- UNIQUE constraint on users.email prevents duplicate accounts
- NOT NULL constraints ensure required fields are populated
- Boolean defaults ensure consistent initial states

## Indexing Strategy

### Required Indexes
- `idx_tasks_user_id`: Optimize queries for user's tasks
- `idx_tasks_completed`: Optimize queries for completed/incomplete tasks
- `idx_tasks_created_at`: Optimize queries for chronological task ordering

### Potential Future Indexes
- Composite index on (user_id, completed) for filtered queries
- Index on due_date if date-based queries become common