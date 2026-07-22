import { addDays, todayISO } from '../utils/helpers.js';

const today = todayISO();

export const seedData = {
  schools: [
    {
      id: 'sch_1',
      name: "Auto-École Atlas Conduite",
      address: '12 Rue Ibn Khaldoun, Maârif',
      city: 'Casablanca',
      phone: '0522-45-12-30',
      agrement: 'AG-CAS-2014-0231',
      active: true,
    },
  ],

  courses: [
    {
      id: 'crs_1',
      schoolId: 'sch_1',
      name: 'Permis B — Formation Complète',
      category: 'B',
      theoryHours: 20,
      practiceHours: 20,
      price: 3500,
      startDate: today,
      status: 'open',
      paymentPlan: { type: 'installments', installments: 3 },
    },
    {
      id: 'crs_2',
      schoolId: 'sch_1',
      name: 'Permis A — Deux Roues',
      category: 'A',
      theoryHours: 10,
      practiceHours: 12,
      price: 2200,
      startDate: addDays(today, 7),
      status: 'open',
      paymentPlan: { type: 'full', installments: 1 },
    },
    {
      id: 'crs_3',
      schoolId: 'sch_1',
      name: 'Permis EB — Remorque',
      category: 'EB',
      theoryHours: 6,
      practiceHours: 8,
      price: 1800,
      startDate: addDays(today, -30),
      status: 'closed',
      paymentPlan: { type: 'full', installments: 1 },
    },
  ],

  instructors: [
    {
      id: 'ins_1',
      name: 'Karim Benjelloun',
      cin: 'BE482910',
      phone: '0661-22-33-44',
      licenseNumber: 'MON-2011-3390',
      categories: ['B', 'EB'],
      active: true,
    },
    {
      id: 'ins_2',
      name: 'Sanaa El Fassi',
      cin: 'BK119284',
      phone: '0662-98-11-05',
      licenseNumber: 'MON-2016-8821',
      categories: ['A', 'A1', 'B'],
      active: true,
    },
  ],

  students: [
    {
      id: 'stu_1',
      name: 'Youssef Idrissi',
      cin: 'BE773310',
      dob: '2005-03-14',
      phone: '0611-22-10-88',
      address: '5 Rue Tanger, Bourgogne',
      active: true,
      guardianConsent: false,
    },
    {
      id: 'stu_2',
      name: 'Salma Bouzid',
      cin: 'BK204471',
      dob: '2000-11-02',
      phone: '0655-90-44-21',
      address: '18 Bd Zerktouni',
      active: true,
      guardianConsent: false,
    },
    {
      id: 'stu_3',
      name: 'Ayoub Chraibi',
      cin: 'BJ902341',
      dob: '1999-06-21',
      phone: '0678-30-19-52',
      address: "44 Rue d'Alger",
      active: true,
      guardianConsent: false,
    },
  ],

  cars: [
    {
      id: 'car_1',
      plate: '4521-A-12',
      brand: 'Renault',
      model: 'Clio',
      transmission: 'Manual',
      category: 'B',
      status: 'available',
    },
    {
      id: 'car_2',
      plate: '9081-B-45',
      brand: 'Dacia',
      model: 'Logan',
      transmission: 'Manual',
      category: 'B',
      status: 'available',
    },
    {
      id: 'car_3',
      plate: '3310-C-77',
      brand: 'Yamaha',
      model: 'YBR 125',
      transmission: 'Manual',
      category: 'A',
      status: 'maintenance',
    },
  ],

  carAssignments: [
    { id: 'ca_1', carId: 'car_1', instructorId: 'ins_1', from: today, to: addDays(today, 30) },
  ],

  sessions: [
    {
      id: 'ses_1',
      courseId: 'crs_1',
      date: addDays(today, 2),
      time: '09:00',
      room: 'Salle 1',
      instructorId: 'ins_1',
      carId: null,
      seats: 15,
      assignedStudentIds: ['stu_1', 'stu_2'],
      status: 'scheduled',
    },
    {
      id: 'ses_2',
      courseId: 'crs_2',
      date: addDays(today, 9),
      time: '14:00',
      room: 'Salle 2',
      instructorId: 'ins_2',
      carId: null,
      seats: 2,
      assignedStudentIds: ['stu_3'],
      status: 'scheduled',
    },
  ],

  enrollments: [
    { id: 'enr_1', studentId: 'stu_1', courseId: 'crs_1', status: 'active', enrolledAt: today },
    { id: 'enr_2', studentId: 'stu_2', courseId: 'crs_1', status: 'active', enrolledAt: today },
    { id: 'enr_3', studentId: 'stu_3', courseId: 'crs_2', status: 'active', enrolledAt: today },
  ],

  classes: [
    {
      id: 'cls_1',
      studentId: 'stu_1',
      instructorId: 'ins_1',
      courseId: 'crs_1',
      carId: 'car_1',
      date: addDays(today, -3),
      time: '10:00',
      status: 'completed',
    },
    {
      id: 'cls_2',
      studentId: 'stu_1',
      instructorId: 'ins_1',
      courseId: 'crs_1',
      carId: 'car_1',
      date: addDays(today, 4),
      time: '11:00',
      status: 'scheduled',
    },
  ],

  payments: [
    { id: 'pay_1', studentId: 'stu_1', courseId: 'crs_1', amount: 1200, date: today, method: 'cash' },
    { id: 'pay_2', studentId: 'stu_2', courseId: 'crs_1', amount: 3500, date: today, method: 'card' },
  ],

  comments: [
    {
      id: 'cmt_1',
      studentId: 'stu_1',
      classId: 'cls_1',
      courseId: 'crs_1',
      instructorId: 'ins_1',
      text: 'Great first practical session, very clear explanations on parking.',
      rating: 5,
      date: addDays(today, -3),
    },
  ],

  grades: [
    { id: 'grd_1', studentId: 'stu_1', courseId: 'crs_1', type: 'Theory Mock Test', score: 32, maxScore: 40, date: addDays(today, -5) },
    { id: 'grd_2', studentId: 'stu_1', courseId: 'crs_1', type: 'Practical Evaluation', score: 14, maxScore: 20, date: addDays(today, -3) },
  ],

  notifications: [
    { id: 'ntf_1', studentId: 'stu_1', message: 'Your practical class is confirmed for the upcoming session.', date: today, read: false, type: 'class' },
    { id: 'ntf_2', studentId: 'stu_2', message: 'Reminder: theory session starts in 2 days.', date: today, read: false, type: 'reminder' },
  ],

  simulatorSessions: [],

  examAttempts: [],
};
