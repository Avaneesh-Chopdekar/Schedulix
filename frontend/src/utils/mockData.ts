export const teachers = [
  {
    id: 1,
    employeeId: "EMP-1001",
    name: "Rahul Sharma",
    email: "rahul@college.edu",
    mobile: "9876543210",
    department: "Computer Science",
    status: "Active",
  },
  {
    id: 2,
    employeeId: "EMP-1002",
    name: "Priya Shah",
    email: "priya@college.edu",
    mobile: "9876543211",
    department: "Information Technology",
    status: "Active",
  },
  {
    id: 3,
    employeeId: "EMP-1003",
    name: "Amit Patel",
    email: "amit@college.edu",
    mobile: "9876543212",
    department: "Computer Science",
    status: "Active",
  },
  {
    id: 4,
    employeeId: "EMP-1004",
    name: "Sneha Mehta",
    email: "sneha@college.edu",
    mobile: "9876543213",
    department: "Mathematics",
    status: "Inactive",
  },
];

export const subjects = [
  {
    id: 1,
    code: "CS301",
    name: "Database Management Systems",
    semester: 3,
    credits: 4,
    type: "Theory",
    lecturesPerWeek: 4,
  },
  {
    id: 2,
    code: "CS302",
    name: "Object Oriented Programming",
    semester: 3,
    credits: 4,
    type: "Theory",
    lecturesPerWeek: 4,
  },
  {
    id: 3,
    code: "CS303",
    name: "Web Development",
    semester: 3,
    credits: 3,
    type: "Theory",
    lecturesPerWeek: 3,
  },
  {
    id: 4,
    code: "CS304",
    name: "Database Management Systems Lab",
    semester: 3,
    credits: 2,
    type: "Practical",
    lecturesPerWeek: 2,
  },
  {
    id: 5,
    code: "CS305",
    name: "Computer Networks",
    semester: 3,
    credits: 4,
    type: "Theory",
    lecturesPerWeek: 4,
  },
];

export const classrooms = [
  {
    id: 1,
    roomNumber: "301",
    building: "Main Building",
    capacity: 60,
    type: "Classroom",
    floor: 3,
    status: "Available",
  },
  {
    id: 2,
    roomNumber: "302",
    building: "Main Building",
    capacity: 60,
    type: "Classroom",
    floor: 3,
    status: "Available",
  },
  {
    id: 3,
    roomNumber: "LAB-1",
    building: "Science Block",
    capacity: 40,
    type: "Laboratory",
    floor: 1,
    status: "Available",
  },
  {
    id: 4,
    roomNumber: "LAB-2",
    building: "Science Block",
    capacity: 40,
    type: "Laboratory",
    floor: 1,
    status: "Maintenance",
  },
  {
    id: 5,
    roomNumber: "401",
    building: "Main Building",
    capacity: 100,
    type: "Classroom",
    floor: 4,
    status: "Available",
  },
];

export const timeSlots = [
  {
    id: 1,
    day: "Monday",
    slotNumber: 1,
    startTime: "09:00",
    endTime: "10:00",
  },
  {
    id: 2,
    day: "Monday",
    slotNumber: 2,
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    id: 3,
    day: "Monday",
    slotNumber: 3,
    startTime: "11:15",
    endTime: "12:15",
  },
  {
    id: 4,
    day: "Tuesday",
    slotNumber: 1,
    startTime: "09:00",
    endTime: "10:00",
  },
  {
    id: 5,
    day: "Tuesday",
    slotNumber: 2,
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    id: 6,
    day: "Wednesday",
    slotNumber: 1,
    startTime: "09:00",
    endTime: "10:00",
  },
  {
    id: 7,
    day: "Thursday",
    slotNumber: 1,
    startTime: "09:00",
    endTime: "10:00",
  },
  {
    id: 8,
    day: "Friday",
    slotNumber: 1,
    startTime: "09:00",
    endTime: "10:00",
  },
];

export const timetableEntries = [
  {
    id: 1,
    day: "Monday",
    slotNumber: 1,
    startTime: "09:00",
    endTime: "10:00",

    subjectCode: "CS301",
    subjectName: "Database Management Systems",

    teacher: "Rahul Sharma",
    room: "301",

    semester: 3,
    section: "A",

    type: "Theory",
    hasConflict: false,
  },

  {
    id: 2,
    day: "Monday",
    slotNumber: 2,
    startTime: "10:00",
    endTime: "11:00",

    subjectCode: "CS302",
    subjectName: "Object Oriented Programming",

    teacher: "Priya Shah",
    room: "302",

    semester: 3,
    section: "A",

    type: "Theory",
    hasConflict: false,
  },

  {
    id: 3,
    day: "Monday",
    slotNumber: 3,
    startTime: "11:15",
    endTime: "12:15",

    subjectCode: "CS304",
    subjectName: "DBMS Laboratory",

    teacher: "Amit Patel",
    room: "LAB-1",

    semester: 3,
    section: "A",

    type: "Practical",
    hasConflict: false,
  },

  {
    id: 4,
    day: "Tuesday",
    slotNumber: 1,
    startTime: "09:00",
    endTime: "10:00",

    subjectCode: "CS305",
    subjectName: "Computer Networks",

    teacher: "Sneha Mehta",
    room: "401",

    semester: 3,
    section: "A",

    type: "Theory",
    hasConflict: false,
  },

  {
    id: 5,
    day: "Tuesday",
    slotNumber: 2,
    startTime: "10:00",
    endTime: "11:00",

    subjectCode: "CS303",
    subjectName: "Web Development",

    teacher: "Rahul Sharma",
    room: "301",

    semester: 3,
    section: "A",

    type: "Theory",
    hasConflict: false,
  },

  {
    id: 6,
    day: "Wednesday",
    slotNumber: 1,
    startTime: "09:00",
    endTime: "10:00",

    subjectCode: "CS302",
    subjectName: "Object Oriented Programming",

    teacher: "Priya Shah",
    room: "302",

    semester: 3,
    section: "A",

    type: "Theory",
    hasConflict: false,
  },

  {
    id: 7,
    day: "Wednesday",
    slotNumber: 2,
    startTime: "10:00",
    endTime: "11:00",

    subjectCode: "CS301",
    subjectName: "Database Management Systems",

    teacher: "Rahul Sharma",
    room: "301",

    semester: 3,
    section: "A",

    type: "Theory",
    hasConflict: false,
  },

  {
    id: 8,
    day: "Thursday",
    slotNumber: 1,
    startTime: "09:00",
    endTime: "10:00",

    subjectCode: "CS303",
    subjectName: "Web Development",

    teacher: "Rahul Sharma",
    room: "401",

    semester: 3,
    section: "A",

    type: "Theory",
    hasConflict: false,
  },

  {
    id: 9,
    day: "Thursday",
    slotNumber: 2,
    startTime: "10:00",
    endTime: "11:00",

    subjectCode: "CS305",
    subjectName: "Computer Networks",

    teacher: "Sneha Mehta",
    room: "301",

    semester: 3,
    section: "A",

    type: "Theory",
    hasConflict: false,
  },

  {
    id: 10,
    day: "Friday",
    slotNumber: 1,
    startTime: "09:00",
    endTime: "10:00",

    subjectCode: "CS301",
    subjectName: "Database Management Systems",

    teacher: "Rahul Sharma",
    room: "301",

    semester: 3,
    section: "A",

    type: "Theory",
    hasConflict: false,
  },

  {
    id: 11,
    day: "Friday",
    slotNumber: 2,
    startTime: "10:00",
    endTime: "11:00",

    subjectCode: "CS304",
    subjectName: "DBMS Laboratory",

    teacher: "Amit Patel",
    room: "LAB-1",

    semester: 3,
    section: "A",

    type: "Practical",
    hasConflict: false,
  },
];
