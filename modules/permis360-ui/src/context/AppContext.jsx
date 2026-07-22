import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { toast } from 'sonner';
import { seedData } from '../data/seedData.js';
import { makeId, todayISO } from '../utils/helpers.js';

const STORAGE_KEY = 'auto-ecole-state-v1';

const loadInitialState = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      // Merge onto seedData so any collection added in a later version of the
      // app (e.g. examAttempts) is never missing just because a user's saved
      // state predates it.
      return { ...seedData, ...saved };
    }
  } catch {
    // ignore corrupted storage, fall back to seed
  }
  return seedData;
};

// ---------------------------------------------------------------------------
// Reducer: one flat state object keyed by entity collection name.
// Every action is a plain { type, payload } object -- pure functional style.
// ---------------------------------------------------------------------------

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { collection, item } = action.payload;
      return { ...state, [collection]: [...state[collection], item] };
    }
    case 'UPDATE_ITEM': {
      const { collection, id, patch } = action.payload;
      return {
        ...state,
        [collection]: state[collection].map((it) => (it.id === id ? { ...it, ...patch } : it)),
      };
    }
    case 'DELETE_ITEM': {
      const { collection, id } = action.payload;
      return { ...state, [collection]: state[collection].filter((it) => it.id !== id) };
    }
    case 'SET_COLLECTION': {
      const { collection, items } = action.payload;
      return { ...state, [collection]: items };
    }
    case 'RESET_ALL':
      return seedData;
    default:
      return state;
  }
}

const AppDataContext = createContext(null);

export const AppDataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const pushToast = useCallback((message, variant = 'default') => {
    if (variant === 'danger') toast.error(message);
    else if (variant === 'success') toast.success(message);
    else toast(message);
  }, []);

  // ---- generic helpers -----------------------------------------------
  const addItem = useCallback((collection, item) => {
    dispatch({ type: 'ADD_ITEM', payload: { collection, item } });
    return item;
  }, []);

  const updateItem = useCallback((collection, id, patch) => {
    dispatch({ type: 'UPDATE_ITEM', payload: { collection, id, patch } });
  }, []);

  const deleteItem = useCallback((collection, id) => {
    dispatch({ type: 'DELETE_ITEM', payload: { collection, id } });
  }, []);

  const resetAll = useCallback(() => {
    dispatch({ type: 'RESET_ALL' });
    pushToast('Demo data has been reset.', 'default');
  }, [pushToast]);

  // ---- domain actions with business rules -----------------------------

  const notifyStudent = useCallback(
    (studentId, message, type = 'info') => {
      addItem('notifications', {
        id: makeId('ntf'),
        studentId,
        message,
        date: todayISO(),
        read: false,
        type,
      });
    },
    [addItem]
  );

  const assignCarToInstructor = useCallback(
    (carId, instructorId, from, to) => {
      const conflict = state.carAssignments.some(
        (a) =>
          a.carId === carId &&
          !(to < a.from || from > a.to)
      );
      if (conflict) {
        pushToast('This car is already assigned to another instructor for an overlapping period.', 'danger');
        return { ok: false };
      }
      addItem('carAssignments', { id: makeId('ca'), carId, instructorId, from, to });
      pushToast('Car assigned to instructor.', 'success');
      return { ok: true };
    },
    [state.carAssignments, addItem, pushToast]
  );

  const assignStudentToSession = useCallback(
    (sessionId, studentId) => {
      const session = state.sessions.find((s) => s.id === sessionId);
      if (!session) return { ok: false };
      if (session.assignedStudentIds.includes(studentId)) {
        pushToast('Student is already assigned to this session.', 'danger');
        return { ok: false };
      }
      if (session.assignedStudentIds.length >= session.seats) {
        pushToast('This session is full. Please choose another session.', 'danger');
        return { ok: false };
      }
      const isEnrolled = state.enrollments.some(
        (e) => e.studentId === studentId && e.courseId === session.courseId && e.status === 'active'
      );
      if (!isEnrolled) {
        pushToast('Student must be enrolled in the related course first.', 'danger');
        return { ok: false };
      }
      updateItem('sessions', sessionId, {
        assignedStudentIds: [...session.assignedStudentIds, studentId],
      });
      notifyStudent(studentId, 'You have been added to a session. Check "My Sessions" for details.', 'session');
      pushToast('Student assigned to session.', 'success');
      return { ok: true };
    },
    [state.sessions, state.enrollments, updateItem, pushToast, notifyStudent]
  );

  const removeStudentFromSession = useCallback(
    (sessionId, studentId) => {
      const session = state.sessions.find((s) => s.id === sessionId);
      if (!session) return;
      updateItem('sessions', sessionId, {
        assignedStudentIds: session.assignedStudentIds.filter((id) => id !== studentId),
      });
      notifyStudent(studentId, 'You have been removed from a session.', 'session');
      pushToast('Student removed from session.', 'default');
    },
    [state.sessions, updateItem, pushToast, notifyStudent]
  );

  const cancelSession = useCallback(
    (sessionId) => {
      const session = state.sessions.find((s) => s.id === sessionId);
      if (!session) return;
      updateItem('sessions', sessionId, { status: 'cancelled' });
      session.assignedStudentIds.forEach((studentId) => {
        notifyStudent(studentId, 'A session you were assigned to has been cancelled. Please check for alternate sessions.', 'cancellation');
      });
      pushToast('Session cancelled and students notified.', 'success');
    },
    [state.sessions, updateItem, pushToast, notifyStudent]
  );

  const enrollStudentInCourse = useCallback(
    (studentId, courseId) => {
      const course = state.courses.find((c) => c.id === courseId);
      if (!course) return { ok: false };
      if (course.status !== 'open') {
        pushToast('This course is closed for enrollment.', 'danger');
        return { ok: false };
      }
      const already = state.enrollments.some((e) => e.studentId === studentId && e.courseId === courseId);
      if (already) {
        pushToast('Already enrolled in this course.', 'danger');
        return { ok: false };
      }
      addItem('enrollments', { id: makeId('enr'), studentId, courseId, status: 'active', enrolledAt: todayISO() });
      pushToast('Enrollment successful.', 'success');
      return { ok: true };
    },
    [state.courses, state.enrollments, addItem, pushToast]
  );

  const recordPayment = useCallback(
    (studentId, courseId, amount, method) => {
      const course = state.courses.find((c) => c.id === courseId);
      const paidSoFar = state.payments
        .filter((p) => p.studentId === studentId && p.courseId === courseId)
        .reduce((sum, p) => sum + p.amount, 0);
      const remaining = (course?.price || 0) - paidSoFar;
      if (amount > remaining) {
        pushToast(`Amount exceeds remaining balance (${remaining} MAD). Adjust the payment.`, 'danger');
        return { ok: false };
      }
      addItem('payments', { id: makeId('pay'), studentId, courseId, amount, date: todayISO(), method });
      pushToast('Payment recorded.', 'success');
      return { ok: true };
    },
    [state.courses, state.payments, addItem, pushToast]
  );

  const scheduleClass = useCallback(
    (studentId, instructorId, courseId, date, time, carId) => {
      const conflict = state.classes.some(
        (c) => c.status === 'scheduled' && c.instructorId === instructorId && c.date === date && c.time === time
      );
      if (conflict) {
        pushToast('This instructor already has a class at that time.', 'danger');
        return { ok: false };
      }
      addItem('classes', {
        id: makeId('cls'),
        studentId,
        instructorId,
        courseId,
        carId: carId || null,
        date,
        time,
        status: 'scheduled',
      });
      pushToast('Class scheduled.', 'success');
      return { ok: true };
    },
    [state.classes, addItem, pushToast]
  );

  const cancelClass = useCallback(
    (classId, { lateOverride = false } = {}) => {
      const cls = state.classes.find((c) => c.id === classId);
      if (!cls) return { ok: false };
      const hoursLeft = (new Date(`${cls.date}T${cls.time}`).getTime() - Date.now()) / (1000 * 60 * 60);
      if (hoursLeft < 24 && !lateOverride) {
        return { ok: false, late: true };
      }
      updateItem('classes', classId, { status: 'cancelled' });
      pushToast('Class cancelled.', 'default');
      return { ok: true };
    },
    [state.classes, updateItem, pushToast]
  );

  const addComment = useCallback(
    (studentId, classId, text, rating) => {
      const cls = state.classes.find((c) => c.id === classId);
      if (!cls || cls.status !== 'completed') {
        pushToast('You can only comment on a completed class.', 'danger');
        return { ok: false };
      }
      addItem('comments', {
        id: makeId('cmt'),
        studentId,
        classId,
        courseId: cls.courseId,
        instructorId: cls.instructorId,
        text,
        rating,
        date: todayISO(),
      });
      pushToast('Comment posted.', 'success');
      return { ok: true };
    },
    [state.classes, addItem, pushToast]
  );

  const markNotificationRead = useCallback(
    (id) => updateItem('notifications', id, { read: true }),
    [updateItem]
  );

  const logSimulatorSession = useCallback(
    (studentId, result) => {
      addItem('simulatorSessions', { id: makeId('sim'), studentId, date: todayISO(), ...result });
    },
    [addItem]
  );

  const logExamAttempt = useCallback(
    (studentId, score, total, passed) => {
      addItem('examAttempts', { id: makeId('exam'), studentId, date: todayISO(), score, total, passed });
    },
    [addItem]
  );

  const value = useMemo(
    () => ({
      state,
      pushToast,
      addItem,
      updateItem,
      deleteItem,
      resetAll,
      notifyStudent,
      assignCarToInstructor,
      assignStudentToSession,
      removeStudentFromSession,
      cancelSession,
      enrollStudentInCourse,
      recordPayment,
      scheduleClass,
      cancelClass,
      addComment,
      markNotificationRead,
      logSimulatorSession,
      logExamAttempt,
    }),
    [
      state,
      pushToast,
      addItem,
      updateItem,
      deleteItem,
      resetAll,
      notifyStudent,
      assignCarToInstructor,
      assignStudentToSession,
      removeStudentFromSession,
      cancelSession,
      enrollStudentInCourse,
      recordPayment,
      scheduleClass,
      cancelClass,
      addComment,
      markNotificationRead,
      logSimulatorSession,
      logExamAttempt,
    ]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

export const useAppData = () => {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
};
