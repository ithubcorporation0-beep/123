# API & Server Actions Architecture

## 1. Overview & Security

All API routes and Server Actions must enforce:
- Server-side authentication
- Server-side role checks
- Resource ownership validation
- Active course enrollment checks for learning resources
- Input validation (e.g. with Zod schemas)

---

## 2. API Routes & Server Actions Map

### Courses & Curriculum
- `POST /api/courses`: Create course (Admin / Instructor)
- `PATCH /api/courses/[id]`: Update course details (Owner Instructor / Admin)
- `DELETE /api/courses/[id]`: Delete course (Admin / Owner Instructor)
- `POST /api/courses/[id]/modules`: Create module (Owner Instructor / Admin)
- `POST /api/modules/[id]/lessons`: Create lesson (Owner Instructor / Admin)
- `PATCH /api/lessons/[id]`: Update lesson content / video / resources

### Enrollments & Learning Access
- `POST /api/courses/[id]/enroll`: Create enrollment or initiate checkout
- `GET /api/courses/[id]/lessons/[lessonId]`: Fetch protected lesson data (checks active enrollment or instructor ownership)
- `POST /api/lessons/[id]/progress`: Update lesson completion status

### Quizzes & Assignments
- `POST /api/lessons/[id]/quiz`: Create or update quiz
- `POST /api/quizzes/[id]/attempt`: Submit quiz answers and calculate real score
- `POST /api/lessons/[id]/assignment`: Create or update assignment
- `POST /api/assignments/[id]/submit`: Submit assignment solution
- `PATCH /api/assignments/submissions/[id]/grade`: Grade assignment submission (Instructor)

### Certificates
- `POST /api/courses/[id]/certificate`: Verify 100% course completion and generate unique certificate record
- `GET /api/certificates/[code]`: Public verification and certificate rendering

### Webhooks
- `POST /api/webhooks/clerk`: User synchronization via Svix
- `POST /api/webhooks/mux`: Video upload and processing state updates
- `POST /api/webhooks/payment`: Order confirmation and automatic enrollment activation
