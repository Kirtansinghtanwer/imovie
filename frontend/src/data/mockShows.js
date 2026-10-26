// Helper to format dates YYYY-MM-DD and friendly label
export const generateShowDates = () => {
  const dates = [];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const isoDate = `${year}-${month}-${day}`;

    let label = `${daysOfWeek[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
    if (i === 0) label = `Today, ${d.getDate()} ${months[d.getMonth()]}`;
    else if (i === 1) label = `Tomorrow, ${d.getDate()} ${months[d.getMonth()]}`;

    dates.push({
      isoDate,
      dayName: daysOfWeek[d.getDay()],
      dayNum: d.getDate(),
      monthName: months[d.getMonth()],
      label,
      isToday: i === 0
    });
  }
  return dates;
};

export const mockShowsList = [
  {
    id: "show-201",
    movieId: "mov-001",
    theatreId: "th-101",
    screenId: "scr-101",
    screenName: "Screen 1 - IMAX Laser",
    format: "IMAX 3D",
    language: "English",
    time: "10:30 AM",
    standardPrice: 16.50,
    premiumPrice: 24.00,
    status: "available"
  },
  {
    id: "show-202",
    movieId: "mov-001",
    theatreId: "th-101",
    screenId: "scr-101",
    screenName: "Screen 1 - IMAX Laser",
    format: "IMAX 3D",
    language: "English",
    time: "02:15 PM",
    standardPrice: 16.50,
    premiumPrice: 24.00,
    status: "filling_fast"
  },
  {
    id: "show-203",
    movieId: "mov-001",
    theatreId: "th-101",
    screenId: "scr-102",
    screenName: "Screen 2 - Dolby Atmos",
    format: "Dolby Cinema",
    language: "English",
    time: "06:00 PM",
    standardPrice: 15.00,
    premiumPrice: 22.00,
    status: "available"
  },
  {
    id: "show-204",
    movieId: "mov-001",
    theatreId: "th-101",
    screenId: "scr-102",
    screenName: "Screen 2 - Dolby Atmos",
    format: "Dolby Cinema",
    language: "English",
    time: "09:45 PM",
    standardPrice: 15.00,
    premiumPrice: 22.00,
    status: "almost_full"
  },
  {
    id: "show-205",
    movieId: "mov-001",
    theatreId: "th-102",
    screenId: "scr-104",
    screenName: "Screen 4 - 70mm Auditorium",
    format: "IMAX 70mm",
    language: "English",
    time: "11:00 AM",
    standardPrice: 17.00,
    premiumPrice: 25.00,
    status: "available"
  },
  {
    id: "show-206",
    movieId: "mov-001",
    theatreId: "th-102",
    screenId: "scr-104",
    screenName: "Screen 4 - 70mm Auditorium",
    format: "IMAX 70mm",
    language: "English",
    time: "03:30 PM",
    standardPrice: 17.00,
    premiumPrice: 25.00,
    status: "filling_fast"
  },
  {
    id: "show-207",
    movieId: "mov-001",
    theatreId: "th-102",
    screenId: "scr-105",
    screenName: "Screen 5 - Standard 4K",
    format: "2D 4K",
    language: "English",
    time: "07:30 PM",
    standardPrice: 14.00,
    premiumPrice: 20.00,
    status: "available"
  },

  // Oppenheimer shows
  {
    id: "show-208",
    movieId: "mov-002",
    theatreId: "th-101",
    screenId: "scr-103",
    screenName: "Screen 3 - Prime 4K",
    format: "Dolby Cinema",
    language: "English",
    time: "01:00 PM",
    standardPrice: 15.50,
    premiumPrice: 22.50,
    status: "available"
  },
  {
    id: "show-209",
    movieId: "mov-002",
    theatreId: "th-101",
    screenId: "scr-103",
    screenName: "Screen 3 - Prime 4K",
    format: "Dolby Cinema",
    language: "English",
    time: "05:30 PM",
    standardPrice: 15.50,
    premiumPrice: 22.50,
    status: "available"
  },
  {
    id: "show-210",
    movieId: "mov-002",
    theatreId: "th-102",
    screenId: "scr-104",
    screenName: "Screen 4 - 70mm Auditorium",
    format: "IMAX 70mm",
    language: "English",
    time: "08:15 PM",
    standardPrice: 18.00,
    premiumPrice: 26.00,
    status: "filling_fast"
  },

  // Kalki 2898 AD shows
  {
    id: "show-211",
    movieId: "mov-007",
    theatreId: "th-101",
    screenId: "scr-102",
    screenName: "Screen 2 - Dolby Atmos",
    format: "3D",
    language: "Hindi",
    time: "12:15 PM",
    standardPrice: 14.00,
    premiumPrice: 20.00,
    status: "available"
  },
  {
    id: "show-212",
    movieId: "mov-007",
    theatreId: "th-101",
    screenId: "scr-102",
    screenName: "Screen 2 - Dolby Atmos",
    format: "3D",
    language: "Hindi",
    time: "04:30 PM",
    standardPrice: 14.00,
    premiumPrice: 20.00,
    status: "available"
  },
  {
    id: "show-213",
    movieId: "mov-007",
    theatreId: "th-102",
    screenId: "scr-106",
    screenName: "Screen 6 - Luxe 3D",
    format: "3D",
    language: "Hindi",
    time: "08:00 PM",
    standardPrice: 14.00,
    premiumPrice: 20.00,
    status: "filling_fast"
  }
];

// Generates an interactive seat layout matrix for a given show
export const generateSeatLayout = (showId) => {
  const rows = [
    { row: "A", type: "standard", priceMultiplier: 1.0 },
    { row: "B", type: "standard", priceMultiplier: 1.0 },
    { row: "C", type: "standard", priceMultiplier: 1.0 },
    { row: "D", type: "standard", priceMultiplier: 1.0 },
    { row: "E", type: "standard", priceMultiplier: 1.0 },
    { row: "F", type: "premium", priceMultiplier: 1.35 },
    { row: "G", type: "premium", priceMultiplier: 1.35 },
    { row: "H", type: "vip", priceMultiplier: 1.6 },
    { row: "J", type: "vip", priceMultiplier: 1.6 }
  ];

  // Deterministic occupied seats based on showId hash
  const seed = showId ? showId.charCodeAt(showId.length - 1) : 42;
  const occupiedSet = new Set([
    "B4", "B5", "C6", "C7", "C8",
    "D3", "D4", "E7", "E8", "E9",
    "F5", "F6", "G7", "G8", "H4", "H5"
  ]);

  return rows.map((r) => {
    const seats = [];
    for (let num = 1; num <= 12; num++) {
      const seatCode = `${r.row}${num}`;
      const isOccupied = occupiedSet.has(seatCode) || ((seed + num * 3) % 7 === 0 && r.row !== "A");
      seats.push({
        id: seatCode,
        row: r.row,
        number: num,
        type: r.type,
        status: isOccupied ? "occupied" : "available"
      });
    }
    return {
      row: r.row,
      type: r.type,
      seats
    };
  });
};
