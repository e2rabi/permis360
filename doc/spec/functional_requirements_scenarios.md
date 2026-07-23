# Functional Scenarios — Driving School Management System (Morocco)

Format: Gherkin (Given / When / Then), one feature per capability, happy path + key edge cases.
Domain notes reflected in the scenarios: student CIN (national ID) as unique identifier, permit categories (A1, A, B, C, D, EB), cash and installment payments, seat-limited sessions.

---

## ROLE: MANAGER

### Feature: Manage a school

```gherkin
Feature: School creation and management

  Scenario: Manager creates a new school
    Given the manager is authenticated
    And no school exists with the same registered name and city and email
    When the manager submits the school name, address, city, phone number, and license/agrément number ,logo
    Then a new school record is created
    And the school appears in the manager's dashboard

  Scenario: Manager attempts to create a duplicate school
    Given a school already exists with the same agrément number
    When the manager submits a school with that same agrément number
    Then the system rejects the creation
    And displays an error indicating the agrément number is already registered

  Scenario: Manager updates school information
    Given a school already exists
    When the manager edits the address, phone number, or opening hours ,logo ,phone number
    Then the changes are saved
    And a confirmation is shown

  Scenario: Manager deactivates a school
    Given a school has active courses, students, or instructors
    When the manager attempts to delete the school
    Then the system prevents hard deletion
    And offers to deactivate (archive) the school instead
```

---

### Feature: Manage a course

```gherkin
Feature: Course creation and management

  Scenario: Manager creates a new course
    Given the manager is authenticated and a school exists
    When the manager provides course name, permit category (A1/A/B/C/D/EB), duration (theory hours + practice hours), price, and start date
    Then the course is created and linked to the school
    And the course status is set to "open for enrollment"

  Scenario: Manager sets course price and installment options
    Given a course exists
    When the manager defines the total price and allowed payment plan (full payment or N installments)
    Then the payment plan is attached to the course
    And is applied automatically when a student enrolls

  Scenario: Manager edits a course with enrolled students
    Given a course has one or more enrolled students
    When the manager changes the price or duration
    Then the system warns that existing enrolled students will be affected
    And asks for confirmation before applying the change

  Scenario: Manager closes or archives a course
    Given a course has ended or reached its enrollment deadline
    When the manager marks the course as "closed"
    Then no new students can enroll
    And existing students retain access to their grades and history
```

---

### Feature: Manage an instructor

```gherkin
Feature: Instructor creation and management

  Scenario: Manager registers a new instructor
    Given the manager is authenticated
    When the manager submits the instructor's name, CIN,photo, phone, monitor license number, and authorized permit categories
    Then the instructor account is created
    And the instructor can be assigned to sessions and cars

  Scenario: Manager rejects invalid instructor license
    Given the manager enters an instructor's monitor license number
    When the license number format is invalid or already exists in the system
    Then the system displays a validation error
    And the instructor is not created

  Scenario: Manager updates instructor availability
    Given an instructor is registered
    When the manager sets weekly availability slots
    Then the instructor can only be scheduled within those slots

  Scenario: Manager deactivates an instructor
    Given an instructor has upcoming assigned sessions
    When the manager deactivates that instructor
    Then the system flags all affected upcoming sessions
    And prompts the manager to reassign or cancel them
```

---

### Feature: Manage a student

```gherkin
Feature: Student creation and management

  Scenario: Manager registers a new student
    Given the manager is authenticated
    When the manager submits the student's name, CIN, date of birth, phone, and address
    Then a student account is created with default login credentials
    And an activation notification is sent to the student

  Scenario: Manager registers a student under the legal minimum age without guardian consent
    Given the driving category requires a minimum age (e.g., 18 for category B)
    When the manager tries to register a student below that age without a guardian consent document
    Then the system blocks the registration
    And requests guardian consent information

  Scenario: Manager edits student personal information
    Given a student exists in the system
    When the manager updates contact details or address
    Then the changes are saved
    And the student is notified of the update

  Scenario: Manager suspends a student account
    Given a student has an outstanding unpaid balance beyond the due date
    When the manager suspends the student's account
    Then the student can no longer schedule new classes
    And the student still retains read-only access to grades and history
```

---

### Feature: Manage cars

```gherkin
Feature: Car creation and management

  Scenario: Manager registers a new car
    Given the manager is authenticated
    When the manager submits the car's plate number, brand, model, transmission type, and permit category it supports
    Then the car is added to the school's fleet
    And is available for instructor assignment

  Scenario: Manager marks a car as under maintenance
    Given a car is currently assigned to an instructor with upcoming sessions
    When the manager marks the car as "under maintenance"
    Then the car becomes unavailable for new assignments
    And the manager is prompted to assign a replacement car to affected sessions

  Scenario: Manager removes a car from the fleet
    Given a car has no upcoming assigned sessions
    When the manager deletes the car record
    Then the car is removed from the fleet
    And historical session records referencing it are preserved

  Scenario: Manager attempts to register a duplicate plate number
    Given a car already exists with a given plate number
    When the manager submits a new car with the same plate number
    Then the system rejects the submission
    And shows a duplicate plate number error
```

---

### Feature: Assign a car to an instructor

```gherkin
Feature: Car-to-instructor assignment

  Scenario: Manager assigns an available car to an instructor
    Given an instructor exists and a car is available (not under maintenance, not already assigned for the same time slot)
    When the manager assigns the car to the instructor for a given session or period
    Then the assignment is saved
    And the car no longer appears as available for that same time slot to other instructors

  Scenario: Manager attempts to assign a car already in use
    Given a car is already assigned to another instructor for an overlapping time slot
    When the manager tries to assign the same car to a different instructor for that slot
    Then the system blocks the assignment
    And displays a scheduling conflict message

  Scenario: Manager reassigns a car between instructors
    Given a car is currently assigned to Instructor A
    When the manager reassigns it to Instructor B for a future period with no conflicts
    Then the car assignment is updated
    And Instructor A no longer sees the car in their fleet
```

---

### Feature: Assign a student to a session (room)

```gherkin
Feature: Student-to-session assignment

  Scenario: Manager assigns a student to a session with available seats
    Given a session has available seats
    And the student is enrolled in the corresponding course
    When the manager assigns the student to the session
    Then the student is added to the session roster
    And the session's remaining seat count decreases by one

  Scenario: Manager attempts to assign a student to a full session
    Given a session has zero remaining seats
    When the manager tries to assign a student to that session
    Then the system rejects the assignment
    And suggests other sessions with availability

  Scenario: Manager attempts to assign a student not enrolled in the related course
    Given the student is not enrolled in the course linked to the session
    When the manager tries to assign the student to that session
    Then the system blocks the assignment
    And prompts the manager to enroll the student in the course first

  Scenario: Manager removes a student from a session
    Given a student is assigned to a session
    When the manager removes the student from the session
    Then the seat is released back to the session's available count
    And the student is notified of the change
```

---

### Feature: Create and manage sessions (rooms)

```gherkin
Feature: Session (room) creation and management

  Scenario: Manager creates a new session
    Given a course and an instructor exist
    When the manager defines the session date, time, location/room, instructor, car (if practical), and number of seats
    Then the session is created and linked to the course
    And appears as available for student assignment

  Scenario: Manager sets seat capacity for a theory session
    Given a room has a fixed physical capacity
    When the manager sets the number of seats equal to or below the room's capacity
    Then the seat limit is enforced when assigning students

  Scenario: Manager exceeds physical room capacity
    Given a room's maximum capacity is known
    When the manager tries to set a seat count above that capacity
    Then the system warns about exceeding capacity
    And requires explicit confirmation or a corrected value

  Scenario: Manager cancels a session
    Given a session has assigned students
    When the manager cancels the session
    Then all assigned students are notified automatically
    And the manager is prompted to reschedule or offer alternate sessions
```

---

### Feature: Notify students

```gherkin
Feature: Student notifications

  Scenario: Manager sends a manual notification
    Given one or more students are selected
    When the manager writes a message and sends it
    Then the students receive the notification (in-app and/or SMS/email)

  Scenario: System sends automatic upcoming class reminders
    Given a student is assigned to a session starting within the configured reminder window (e.g., 24 hours)
    When the reminder time is reached
    Then the system automatically sends a notification to the student

  Scenario: Manager notifies students of a session cancellation
    Given a session is cancelled
    When the cancellation is confirmed
    Then all students assigned to that session are notified immediately with the reason and next steps

  Scenario: Notification delivery failure
    Given a student's contact information (phone/email) is invalid or missing
    When the system attempts to send a notification
    Then the notification is logged as failed
    And the manager is alerted to update the student's contact information
```

---

### Feature: Manage payment status

```gherkin
Feature: Payment management

  Scenario: Manager records a payment
    Given a student owes an amount for a course
    When the manager records a payment (cash, card, or transfer) with amount and date
    Then the student's balance is updated
    And a receipt is generated

  Scenario: Manager records a partial/installment payment
    Given a course has an installment payment plan
    When the manager records one installment payment
    Then the remaining balance and next due date are updated accordingly

  Scenario: Manager views overdue payments
    Given one or more students have unpaid balances past their due date
    When the manager opens the payment status view
    Then the system lists all overdue students with amounts and days overdue

  Scenario: Manager marks a course as fully paid
    Given a student has paid the full course amount
    When the last payment is recorded
    Then the student's payment status changes to "Paid in full"
    And the student regains full access if previously restricted for non-payment

  Scenario: Manager attempts to record a payment exceeding the remaining balance
    Given a student owes a specific remaining amount
    When the manager enters a payment amount greater than the remaining balance
    Then the system rejects the entry or flags it for confirmation as an overpayment/credit
```

---

### Feature: Manage list of students enrolled in a course

```gherkin
Feature: Enrolled students list management

  Scenario: Manager views the list of students enrolled in a course
    Given a course has enrolled students
    When the manager opens the course's enrollment list
    Then all enrolled students are displayed with their status (active, suspended, completed)

  Scenario: Manager removes a student from a course
    Given a student is enrolled in a course with no completed sessions
    When the manager removes the student from the course
    Then the student's enrollment is cancelled
    And any related session assignments for that course are also removed

  Scenario: Manager filters enrolled students by payment or progress status
    Given a course has multiple enrolled students
    When the manager filters by "unpaid" or "in progress"
    Then only matching students are shown

  Scenario: Manager exports the enrollment list
    Given a course has enrolled students
    When the manager requests an export (CSV/PDF)
    Then a downloadable file with the enrollment list is generated
```

---

## ROLE: STUDENT

### Feature: View profile

```gherkin
Feature: Student profile view

  Scenario: Student views their profile
    Given the student is authenticated
    When the student navigates to "My Profile"
    Then their personal information, enrolled school, and course history are displayed

  Scenario: Student requests a profile information update
    Given the student wants to change contact details
    When the student submits an update request
    Then the request is sent to the manager for approval
    And the student sees the request status as "pending"
```

---

### Feature: View grades

```gherkin
Feature: Student grades view

  Scenario: Student views grades for a completed evaluation
    Given the student has taken one or more graded evaluations (theory test, practical test)
    When the student opens "My Grades"
    Then all recorded grades are listed with date and evaluation type

  Scenario: Student views grades before any evaluation has occurred
    Given the student has not yet taken any evaluation
    When the student opens "My Grades"
    Then the system displays an empty state indicating no grades are available yet
```

---

### Feature: Take a course (enroll)

```gherkin
Feature: Course enrollment

  Scenario: Student enrolls in an open course
    Given a course is open for enrollment and matches the student's eligible permit category
    When the student requests to enroll
    Then the student is added to the course
    And an initial payment/payment plan is generated

  Scenario: Student attempts to enroll in a full or closed course
    Given a course has reached its maximum enrollment or is closed
    When the student attempts to enroll
    Then the system blocks the enrollment
    And suggests alternative available courses

  Scenario: Student attempts to enroll without meeting age/category requirements
    Given a course requires a minimum age or prior permit category
    When a student who does not meet the requirement attempts to enroll
    Then the system blocks enrollment
    And explains the unmet requirement
```

---

### Feature: View courses enrolled in / courses taking

```gherkin
Feature: Course lists view

  Scenario: Student views list of enrolled courses
    Given the student is enrolled in one or more courses
    When the student opens "My Courses"
    Then all enrolled courses are listed regardless of status (upcoming, in progress, completed)

  Scenario: Student views list of courses currently in progress
    Given the student has courses with status "in progress"
    When the student opens "Courses I'm Taking"
    Then only currently active/in-progress courses are shown
```

---

### Feature: Schedule / cancel a class with an instructor

```gherkin
Feature: Class scheduling and cancellation

  Scenario: Student schedules a practical class with an available instructor
    Given the student is enrolled in a course requiring practical classes
    And an instructor has an open slot with an available car
    When the student books that slot
    Then the class is scheduled
    And both the student and instructor receive a confirmation notification

  Scenario: Student attempts to book a slot that is already taken
    Given an instructor's slot has just been booked by another student
    When the student tries to book the same slot
    Then the system prevents the double-booking
    And refreshes the list of available slots

  Scenario: Student cancels a scheduled class within the allowed cancellation window
    Given a class is scheduled more than the minimum cancellation notice (e.g., 24 hours) away
    When the student cancels the class
    Then the slot becomes available again
    And the instructor is notified

  Scenario: Student attempts to cancel a class too close to its start time
    Given a class starts within the minimum cancellation notice window
    When the student attempts to cancel
    Then the system warns that a late-cancellation policy applies (e.g., forfeited session or fee)
    And requires confirmation before proceeding
```

---

### Feature: Leave a comment on a class

```gherkin
Feature: Class feedback

  Scenario: Student leaves a comment after a completed class
    Given the student has completed a class
    When the student submits a comment/rating about the course and the instructor
    Then the feedback is saved and linked to that class, course, and instructor

  Scenario: Student attempts to comment on a class that hasn't occurred yet
    Given a class is scheduled but not yet completed
    When the student tries to leave a comment
    Then the system disables commenting until the class is marked completed

  Scenario: Student edits or deletes their own comment
    Given the student previously left a comment
    When the student edits or deletes it within the allowed edit window
    Then the change is applied and reflected in the instructor/course feedback history
```

---

### Feature: View list of sessions taking

```gherkin
Feature: Session list view

  Scenario: Student views upcoming sessions
    Given the student is assigned to one or more future sessions
    When the student opens "My Sessions"
    Then all upcoming sessions are listed with date, time, instructor/room, and location

  Scenario: Student views past sessions
    Given the student has completed sessions
    When the student filters by "past"
    Then completed sessions are listed with attendance status
```

---

### Feature: Play with the simulator

```gherkin
Feature: Driving simulator access

  Scenario: Student launches the simulator
    Given the student's account is active and in good standing (not suspended)
    When the student opens the simulator module
    Then the simulator loads and the student can begin a practice session

  Scenario: Suspended student attempts to access the simulator
    Given the student's account is suspended for non-payment
    When the student attempts to open the simulator
    Then access is denied
    And a message directs the student to resolve their payment status

  Scenario: Student's simulator session is saved
    Given the student completes a simulator practice session
    When the session ends
    Then the results/score are saved to the student's history
```

---

### Feature: Get notifications

```gherkin
Feature: Student notifications received

  Scenario: Student receives an upcoming class reminder
    Given the student has a session scheduled within the reminder window
    When the reminder time is reached
    Then the student receives a notification in-app and/or via SMS/email

  Scenario: Student views notification history
    Given the student has received one or more notifications
    When the student opens "Notifications"
    Then all past notifications are listed in chronological order with read/unread status

  Scenario: Student marks a notification as read
    Given an unread notification exists
    When the student opens it
    Then its status changes to "read"
```

---

### Feature: Verify payment status

```gherkin
Feature: Student payment status view

  Scenario: Student views their current payment status
    Given the student has an active course
    When the student opens "My Payments"
    Then the total due, amount paid, remaining balance, and next due date are displayed

  Scenario: Student views payment history
    Given the student has made one or more payments
    When the student opens the payment history section
    Then all past payments are listed with date, amount, and method

  Scenario: Student with overdue balance is warned
    Given the student has a payment overdue
    When the student logs in or opens "My Payments"
    Then a visible warning banner indicates the overdue amount and due date
```

---

## Notes for implementation
- **Unique identifiers**: use CIN for students/instructors to prevent duplicate registration.
- **Seat concurrency**: session seat assignment should be handled atomically to avoid race conditions when two managers assign the last seat simultaneously.
- **Scheduling conflicts**: both car assignment and instructor assignment need overlap-checking logic (same instructor/car can't be in two places at once).
- **Cascading effects**: cancelling a session, deactivating an instructor, or marking a car unavailable should always trigger a review/reassignment workflow rather than silent deletion.
- **Payment plans**: consider modeling payments as a separate ledger (course price, payments made, balance) rather than a single status field, to support installments and overpayment handling cleanly.
