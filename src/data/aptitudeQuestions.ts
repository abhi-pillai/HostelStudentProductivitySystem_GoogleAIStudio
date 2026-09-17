export interface AptitudeQuestion {
  id: number;
  category: 'Arithmetic' | 'Logical' | 'Number Series' | 'Speed & Distance' | 'Percentages';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const APTITUDE_BANK: AptitudeQuestion[] = [
  {
    id: 1,
    category: 'Speed & Distance',
    question: 'A train 240 m in length crosses a telegraph post in 16 seconds. What is the speed of the train in km/h?',
    options: ['45 km/h', '54 km/h', '60 km/h', '72 km/h'],
    correctIndex: 1,
    explanation: 'Speed = 240 m / 16 s = 15 m/s. Convert to km/h: 15 * (18/5) = 54 km/h.'
  },
  {
    id: 2,
    category: 'Percentages',
    question: 'If the price of petrol increases by 25%, by what percentage must a person decrease consumption so expenditure remains unchanged?',
    options: ['20%', '25%', '16.66%', '30%'],
    correctIndex: 0,
    explanation: 'Reduction % = [R / (100 + R)] * 100 = [25 / 125] * 100 = 20%.'
  },
  {
    id: 3,
    category: 'Arithmetic',
    question: 'A and B together can finish a project in 12 days. B alone takes 30 days. How many days will A alone take?',
    options: ['15 days', '18 days', '20 days', '24 days'],
    correctIndex: 2,
    explanation: "1/A = 1/12 - 1/30 = (5 - 2)/60 = 3/60 = 1/20. Thus, A takes 20 days."
  },
  {
    id: 4,
    category: 'Number Series',
    question: 'Find the next number in the sequence: 4, 18, 48, 100, 180, ?',
    options: ['256', '294', '312', '320'],
    correctIndex: 1,
    explanation: 'n^3 - n^2 pattern: 2^3-2^2=4, 3^3-3^2=18, 4^3-4^2=48, 5^3-5^2=100, 6^3-6^2=180, 7^3-7^2=343-49=294.'
  },
  {
    id: 5,
    category: 'Logical',
    question: 'Pointing to a gentleman, Deepak said, "His only brother is the father of my daughter\'s father." How is the gentleman related to Deepak?',
    options: ['Grandfather', 'Father', 'Uncle', 'Brother-in-law'],
    correctIndex: 2,
    explanation: 'My daughter\'s father = Deepak himself. The gentleman\'s brother is Deepak\'s father. So the gentleman is Deepak\'s uncle.'
  },
  {
    id: 6,
    category: 'Percentages',
    question: 'A vendor bought toffees at 6 for a rupee. How many for a rupee must he sell to gain 20%?',
    options: ['3', '4', '5', '6'],
    correctIndex: 2,
    explanation: 'CP of 6 toffees = Re 1. SP of 6 toffees = 120% of 1 = 1.20. For Re 1, number of toffees = 6 / 1.2 = 5.'
  },
  {
    id: 7,
    category: 'Arithmetic',
    question: 'The average age of a class of 30 students is 15 years. If the teacher\'s age is included, the average increases by 1 year. What is the teacher\'s age?',
    options: ['42 years', '44 years', '46 years', '48 years'],
    correctIndex: 2,
    explanation: 'Total students age = 30 * 15 = 450. Total with teacher = 31 * 16 = 496. Teacher age = 496 - 450 = 46.'
  },
  {
    id: 8,
    category: 'Number Series',
    question: 'Find the missing number: 7, 26, 63, 124, 215, ?',
    options: ['342', '343', '341', '512'],
    correctIndex: 0,
    explanation: 'n^3 - 1: 2^3-1=7, 3^3-1=26, 4^3-1=63, 5^3-1=124, 6^3-1=215, 7^3-1 = 343 - 1 = 342.'
  },
  {
    id: 9,
    category: 'Speed & Distance',
    question: 'A boat moves downstream at the rate of 14 km/h and upstream at 8 km/h. Find the speed of the current.',
    options: ['3 km/h', '4 km/h', '5 km/h', '6 km/h'],
    correctIndex: 0,
    explanation: 'Speed of stream = (Downstream speed - Upstream speed) / 2 = (14 - 8) / 2 = 3 km/h.'
  },
  {
    id: 10,
    category: 'Logical',
    question: 'In a code language, SYSTEM is written as SYSMET, and NEARER is written as AENRER. How is FRACTION written?',
    options: ['CARFNOIT', 'CARFTION', 'ARFCNOIT', 'FRACNOIT'],
    correctIndex: 0,
    explanation: 'Divide word into halves of 4 letters: FRAC -> CARF and TION -> NOIT. Concatenated = CARFNOIT.'
  },
  {
    id: 11,
    category: 'Arithmetic',
    question: 'A sum of money doubles itself at simple interest in 8 years. In how many years will it become 4 times itself?',
    options: ['16 years', '20 years', '24 years', '32 years'],
    correctIndex: 2,
    explanation: 'Interest earned = P in 8 years (Rate = 12.5%). To become 4P, Interest = 3P. Time = 3 * 8 = 24 years.'
  },
  {
    id: 12,
    category: 'Percentages',
    question: 'Two numbers are respectively 20% and 50% more than a third number. The ratio of the two numbers is:',
    options: ['2 : 5', '3 : 5', '4 : 5', '6 : 7'],
    correctIndex: 2,
    explanation: 'Let third number = 100. First = 120, Second = 150. Ratio = 120:150 = 4:5.'
  },
  {
    id: 13,
    category: 'Logical',
    question: 'If CLOCK is coded as 34235 and TIME is coded as 8679, how is MOLECULE coded?',
    options: ['72493549', '72493459', '72393459', '72494549'],
    correctIndex: 0,
    explanation: 'Direct letter substitution: M=7, O=2, L=4, E=9, C=3, U=5, L=4, E=9 -> 72493549.'
  },
  {
    id: 14,
    category: 'Speed & Distance',
    question: 'Excluding stoppages, the speed of a bus is 54 km/h and including stoppages, it is 45 km/h. For how many minutes does the bus stop per hour?',
    options: ['9 min', '10 min', '12 min', '15 min'],
    correctIndex: 1,
    explanation: 'Loss in distance = 54 - 45 = 9 km. Time taken to travel 9 km at 54 km/h = (9/54)*60 min = 10 minutes.'
  },
  {
    id: 15,
    category: 'Arithmetic',
    question: 'A pipe can fill a cistern in 6 hours and another pipe can empty it in 8 hours. If both open together, how long will it take to fill?',
    options: ['12 hours', '18 hours', '24 hours', '30 hours'],
    correctIndex: 2,
    explanation: 'Net rate = 1/6 - 1/8 = (4 - 3)/24 = 1/24. Time required = 24 hours.'
  },
  {
    id: 16,
    category: 'Number Series',
    question: 'Find the missing term: 3, 10, 29, 66, 127, ?',
    options: ['216', '218', '220', '224'],
    correctIndex: 1,
    explanation: 'Pattern: n^3 + 2. 1^3+2=3, 2^3+2=10, 3^3+2=29, 4^3+2=66, 5^3+2=127, 6^3+2 = 216+2 = 218.'
  }
];
