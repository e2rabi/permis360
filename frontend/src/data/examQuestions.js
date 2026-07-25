// Question bank modeled on the Moroccan "Code de la Route" exam: traffic signs,
// priority rules, speed limits, documents, and safety regulations.
// `sign` (optional) references a RoadSign type/value to illustrate the question.

export const examQuestions = [
  {
    id: "q1",
    sign: { type: "stop" },
    en: {
      question: "What must you do when you reach this sign?",
      options: [
        "Slow down only if there is traffic",
        "Come to a complete stop, even if the road looks clear",
        "Sound your horn and proceed",
        "Stop only at night",
      ],
      answer: 1,
      explanation:
        "A STOP sign always requires a full stop, regardless of visible traffic, before checking the road and proceeding.",
    },
    ar: {
      question: "باش تتجاوز يمكن ليك تتبع السيارة الكحلة ؟ ",
      options: [
        "1 — نعم",
        "2 — لا",
        "استعمل البوق وتابع السير",
        "التوقف ليلاً فقط",
      ],
      answer: 1,
      explanation:
        'علامة "قف" تستوجب دائمًا التوقف التام قبل التأكد من الطريق ومتابعة السير، بغض النظر عن حركة المرور الظاهرة.',
    },
  },
  {
    id: "q2",
    sign: { type: "yield" },
    en: {
      question: "This triangular sign means:",
      options: [
        "You have priority over other vehicles",
        "Give way to traffic on the road you are joining",
        "No vehicles allowed",
        "Roundabout ahead",
      ],
      answer: 1,
      explanation:
        'The "Yield / Give Way" sign requires you to slow down and let other traffic pass before proceeding.',
    },
    ar: {
      question: "هذه العلامة المثلثة تعني:",
      options: [
        "لديك الأولوية على باقي المركبات",
        "إفساح الطريق لحركة المرور في الطريق الذي تنضم إليه",
        "ممنوع مرور المركبات",
        "دوار أمامك",
      ],
      answer: 1,
      explanation:
        'علامة "أفسح الطريق" تلزمك بالتباطؤ وترك الأولوية للمركبات الأخرى قبل متابعة السير.',
    },
  },
  {
    id: "q3",
    sign: { type: "speedLimit", value: 60 },
    en: {
      question: "What is the maximum speed allowed under this sign?",
      options: ["40 km/h", "60 km/h", "80 km/h", "No limit"],
      answer: 1,
      explanation:
        "The number inside the red circle is the maximum speed in km/h permitted from that point onward.",
    },
    ar: {
      question: "ما هي السرعة القصوى المسموح بها تحت هذه العلامة؟",
      options: ["40 كلم/سا", "60 كلم/سا", "80 كلم/سا", "بدون حد أقصى"],
      answer: 1,
      explanation:
        "الرقم داخل الدائرة الحمراء يمثل السرعة القصوى بالكيلومتر في الساعة المسموح بها ابتداءً من تلك النقطة.",
    },
  },
  {
    id: "q4",
    en: {
      question:
        "In Morocco, what is the general speed limit inside urban/city areas unless otherwise posted?",
      options: ["40 km/h", "60 km/h", "100 km/h", "120 km/h"],
      answer: 1,
      explanation:
        "Unless a different limit is posted, the default urban speed limit in Morocco is 60 km/h.",
    },
    ar: {
      question:
        "في المغرب، ما هي السرعة القصوى العامة داخل المدن ما لم يُنص على خلاف ذلك؟",
      options: ["40 كلم/سا", "60 كلم/سا", "100 كلم/سا", "120 كلم/سا"],
      answer: 1,
      explanation:
        "ما لم تكن هناك علامة تحدد سرعة أخرى، فإن السرعة القصوى الافتراضية داخل المدن في المغرب هي 60 كلم/سا.",
    },
  },
  {
    id: "q5",
    en: {
      question:
        "What is the standard speed limit on Moroccan highways (autoroutes) for light vehicles?",
      options: ["90 km/h", "100 km/h", "120 km/h", "140 km/h"],
      answer: 2,
      explanation:
        "The default maximum speed on Moroccan highways for cars is 120 km/h unless a lower limit is posted.",
    },
    ar: {
      question:
        "ما هي السرعة القصوى المعتادة على الطرق السيارة المغربية بالنسبة للسيارات الخفيفة؟",
      options: ["90 كلم/سا", "100 كلم/سا", "120 كلم/سا", "140 كلم/سا"],
      answer: 2,
      explanation:
        "السرعة القصوى الافتراضية على الطرق السيارة المغربية بالنسبة للسيارات هي 120 كلم/سا ما لم تُحدَّد سرعة أقل.",
    },
  },
  {
    id: "q6",
    sign: { type: "pedestrian" },
    en: {
      question: "Approaching this sign, you must:",
      options: [
        "Accelerate to cross quickly",
        "Slow down and be ready to stop for pedestrians",
        "Sound your horn continuously",
        "Ignore it if no pedestrians are visible yet",
      ],
      answer: 1,
      explanation:
        "A pedestrian crossing sign requires reduced speed and full readiness to stop, since pedestrians have priority on the crossing.",
    },
    ar: {
      question: "عند الاقتراب من هذه العلامة، يجب عليك:",
      options: [
        "تسريع السيارة لعبور المكان بسرعة",
        "التباطؤ والاستعداد للتوقف من أجل المشاة",
        "استعمال البوق باستمرار",
        "تجاهلها إذا لم يظهر مشاة بعد",
      ],
      answer: 1,
      explanation:
        "علامة ممر المشاة تستوجب تخفيف السرعة والاستعداد التام للتوقف، لأن للمشاة الأولوية على الممر.",
    },
  },
  {
    id: "q7",
    sign: { type: "priorityRoad" },
    en: {
      question: "This yellow diamond sign indicates:",
      options: [
        "A dangerous curve ahead",
        "You are on a priority road",
        "End of priority road",
        "A school zone",
      ],
      answer: 1,
      explanation:
        "The yellow diamond sign marks a priority road — vehicles joining from side roads must give way to you.",
    },
    ar: {
      question: "هذه العلامة الصفراء المعينية الشكل تشير إلى:",
      options: [
        "منعطف خطير أمامك",
        "أنت على طريق ذي أولوية",
        "نهاية طريق ذي أولوية",
        "منطقة مدرسية",
      ],
      answer: 1,
      explanation:
        "العلامة الصفراء المعينية تشير إلى طريق ذي أولوية — يجب على المركبات القادمة من طرق جانبية إفساح الطريق لك.",
    },
  },
  {
    id: "q8",
    en: {
      question:
        "At an intersection with no traffic signs or lights, who has priority?",
      options: [
        "The vehicle going straight",
        "The vehicle coming from the right",
        "The larger vehicle",
        "The faster vehicle",
      ],
      answer: 1,
      explanation:
        'Without signs or signals, "priority to the right" applies: the vehicle arriving from your right has priority.',
    },
    ar: {
      question: "عند تقاطع بدون علامات أو إشارات ضوئية، لمن الأولوية؟",
      options: [
        "المركبة المتجهة بشكل مستقيم",
        "المركبة القادمة من اليمين",
        "المركبة الأكبر حجمًا",
        "المركبة الأسرع",
      ],
      answer: 1,
      explanation:
        'في غياب العلامات أو الإشارات، تُطبَّق قاعدة "الأولوية لليمين": للمركبة القادمة من يمينك الأولوية.',
    },
  },
  {
    id: "q9",
    sign: { type: "noEntry" },
    en: {
      question: "This sign means:",
      options: [
        "One-way street ahead",
        "No entry for any vehicle",
        "No parking",
        "Dead end",
      ],
      answer: 1,
      explanation:
        'A solid red circle with a white bar means "No Entry" — vehicles are prohibited from entering that road from this direction.',
    },
    ar: {
      question: "هذه العلامة تعني:",
      options: [
        "طريق ذو اتجاه واحد أمامك",
        "ممنوع الدخول لأي مركبة",
        "ممنوع الوقوف",
        "طريق مسدود",
      ],
      answer: 1,
      explanation:
        'الدائرة الحمراء الممتلئة بشريط أبيض تعني "ممنوع الدخول" — يُمنع على المركبات الدخول إلى ذلك الطريق من هذا الاتجاه.',
    },
  },
  {
    id: "q10",
    sign: { type: "roundabout" },
    en: {
      question:
        "When entering a roundabout in Morocco, you must generally give way to:",
      options: [
        "Vehicles waiting to enter the roundabout",
        "Vehicles already circulating inside the roundabout",
        "Pedestrians crossing far from the roundabout",
        "No one — you always have priority",
      ],
      answer: 1,
      explanation:
        "Vehicles already inside a roundabout normally have priority over vehicles entering it.",
    },
    ar: {
      question:
        "عند الدخول إلى دوار في المغرب، يجب عليك بشكل عام إفساح الطريق لـ:",
      options: [
        "المركبات التي تنتظر للدخول إلى الدوار",
        "المركبات التي تسير بالفعل داخل الدوار",
        "المشاة العابرين بعيدًا عن الدوار",
        "لا أحد — لديك الأولوية دائمًا",
      ],
      answer: 1,
      explanation:
        "المركبات المتواجدة بالفعل داخل الدوار لها الأولوية عادةً على المركبات الراغبة في الدخول إليه.",
    },
  },
  {
    id: "q11",
    en: {
      question: "What is the legal blood alcohol limit for drivers in Morocco?",
      options: [
        "There is a tolerance limit like in some countries",
        "Zero tolerance — any detectable alcohol is an offense",
        "0.5 g/L is allowed",
        "Only applies to professional drivers",
      ],
      answer: 1,
      explanation:
        "Morocco applies a strict zero-tolerance policy: driving with any detectable alcohol level is prohibited.",
    },
    ar: {
      question:
        "ما هو الحد القانوني لنسبة الكحول في الدم بالنسبة للسائقين في المغرب؟",
      options: [
        "يوجد هامش تسامح كما في بعض الدول",
        "صفر تسامح — أي نسبة كحول قابلة للكشف تعتبر مخالفة",
        "يُسمح بـ0.5 غ/ل",
        "ينطبق فقط على السائقين المحترفين",
      ],
      answer: 1,
      explanation:
        'يطبق المغرب سياسة صارمة قائمة على "صفر تسامح": القيادة بأي نسبة كحول قابلة للكشف ممنوعة.',
    },
  },
  {
    id: "q12",
    en: {
      question:
        "Which documents must a driver be able to present during a police check in Morocco?",
      options: [
        "Only the driving license",
        "Driving license and vehicle registration card (carte grise) at minimum",
        "No documents are required if the car is new",
        "Only a national ID card",
      ],
      answer: 1,
      explanation:
        "Drivers must be able to present at minimum a valid driving license and the vehicle registration card, along with proof of insurance.",
    },
    ar: {
      question:
        "ما هي الوثائق التي يجب على السائق تقديمها أثناء مراقبة الشرطة في المغرب؟",
      options: [
        "رخصة السياقة فقط",
        "رخصة السياقة وبطاقة التسجيل (البطاقة الرمادية) على الأقل",
        "لا حاجة لأي وثيقة إذا كانت السيارة جديدة",
        "بطاقة التعريف الوطنية فقط",
      ],
      answer: 1,
      explanation:
        "يجب على السائق أن يكون قادرًا على تقديم رخصة السياقة سارية المفعول والبطاقة الرمادية على الأقل، إلى جانب إثبات التأمين.",
    },
  },
  {
    id: "q13",
    en: {
      question:
        "When is the use of a seatbelt mandatory in a private car in Morocco?",
      options: [
        "Only for the driver",
        "For the driver and front passenger only",
        "For the driver and all passengers, front and rear",
        "Only on highways",
      ],
      answer: 2,
      explanation:
        "Seatbelt use is mandatory for the driver and all passengers, in both front and rear seats.",
    },
    ar: {
      question: "متى يكون استعمال حزام الأمان إجباريًا في سيارة خاصة بالمغرب؟",
      options: [
        "للسائق فقط",
        "للسائق والراكب الأمامي فقط",
        "للسائق وجميع الركاب، الأماميين والخلفيين",
        "على الطرق السيارة فقط",
      ],
      answer: 2,
      explanation:
        "استعمال حزام الأمان إجباري للسائق وجميع الركاب، سواء في المقاعد الأمامية أو الخلفية.",
    },
  },
  {
    id: "q14",
    en: {
      question: "Using a handheld mobile phone while driving is:",
      options: [
        "Allowed if you drive slowly",
        "Allowed only in the city",
        "Prohibited — it is a punishable traffic offense",
        "Allowed for short calls",
      ],
      answer: 2,
      explanation:
        "Using a handheld phone while driving is prohibited and subject to fines, as it is a major distraction.",
    },
    ar: {
      question: "استعمال الهاتف المحمول باليد أثناء القيادة يُعتبر:",
      options: [
        "مسموحًا إذا كنت تقود ببطء",
        "مسموحًا داخل المدينة فقط",
        "ممنوعًا — وهو مخالفة مرورية يعاقب عليها القانون",
        "مسموحًا للمكالمات القصيرة",
      ],
      answer: 2,
      explanation:
        "استعمال الهاتف باليد أثناء القيادة ممنوع ويُعرض صاحبه للغرامة، لأنه يشكل مصدر تشتيت كبير.",
    },
  },
  {
    id: "q15",
    en: {
      question:
        "What should you do when an ambulance or emergency vehicle approaches from behind with sirens on?",
      options: [
        "Speed up to get out of the way",
        "Ignore it if you are already going the speed limit",
        "Slow down and safely clear a path, pulling to the side if possible",
        "Stop immediately in your lane",
      ],
      answer: 2,
      explanation:
        "You should safely move aside and clear the way for emergency vehicles, without creating a hazard by stopping abruptly.",
    },
    ar: {
      question:
        "ماذا يجب أن تفعل عندما تقترب منك سيارة إسعاف أو طوارئ من الخلف بصفارة الإنذار؟",
      options: [
        "تسريع السيارة للابتعاد",
        "تجاهل الأمر إذا كنت تسير بالسرعة القانونية",
        "التباطؤ وإفساح الطريق بأمان، والانحراف جانبًا إن أمكن",
        "التوقف فورًا في مسارك",
      ],
      answer: 2,
      explanation:
        "يجب عليك الانحراف جانبًا بأمان وإفساح الطريق لسيارات الطوارئ، دون التوقف المفاجئ الذي قد يشكل خطرًا.",
    },
  },
  {
    id: "q16",
    en: {
      question: "Before overtaking another vehicle, you should:",
      options: [
        "Just check your side mirror",
        "Signal, check mirrors and blind spot, and ensure the road ahead is clear",
        "Flash your headlights and go",
        "Overtake only if the other car signals you to pass",
      ],
      answer: 1,
      explanation:
        "Safe overtaking requires signaling, checking mirrors and blind spots, and confirming the opposite lane is clear far enough ahead.",
    },
    ar: {
      question: "قبل تجاوز مركبة أخرى، يجب عليك:",
      options: [
        "التحقق من المرآة الجانبية فقط",
        "الإشارة والتحقق من المرايا والزاوية الميتة والتأكد من خلو الطريق أمامك",
        "وميض الأنوار والتجاوز مباشرة",
        "التجاوز فقط إذا أشارت لك المركبة الأخرى بذلك",
      ],
      answer: 1,
      explanation:
        "التجاوز الآمن يتطلب الإشارة، والتحقق من المرايا والزاوية الميتة، والتأكد من خلو المسار المقابل لمسافة كافية.",
    },
  },
  {
    id: "q17",
    sign: { type: "noParking" },
    en: {
      question: 'This blue circle with a red diagonal bar and "P" means:',
      options: [
        "Parking allowed for 1 hour",
        "No parking",
        "Paid parking zone",
        "Parking reserved for police",
      ],
      answer: 1,
      explanation:
        'A "P" inside a circle crossed by a diagonal red bar means parking is prohibited in that area.',
    },
    ar: {
      question: 'هذه الدائرة الزرقاء بشريط أحمر مائل وحرف "P" تعني:',
      options: [
        "يسمح بالوقوف لمدة ساعة واحدة",
        "ممنوع الوقوف",
        "منطقة وقوف مؤدى عنها",
        "موقف مخصص للشرطة",
      ],
      answer: 1,
      explanation:
        'حرف "P" داخل دائرة يقطعها شريط أحمر مائل يعني أن الوقوف ممنوع في تلك المنطقة.',
    },
  },
  {
    id: "q18",
    en: {
      question:
        "The minimum safe following distance behind another vehicle should generally correspond to:",
      options: [
        "Less than 1 second",
        "About a 2-second time gap, more in bad weather",
        "Exactly 5 meters at all speeds",
        "No specific distance is needed below 60 km/h",
      ],
      answer: 1,
      explanation:
        "A common safe rule is to keep at least a 2-second gap behind the vehicle ahead, increasing it in poor visibility or wet roads.",
    },
    ar: {
      question: "المسافة الآمنة الدنيا خلف مركبة أخرى يجب أن تعادل بشكل عام:",
      options: [
        "أقل من ثانية واحدة",
        "حوالي ثانيتين زمنيتين، وأكثر في الأحوال الجوية السيئة",
        "5 أمتار بالضبط في جميع السرعات",
        "لا حاجة لمسافة محددة إذا كانت السرعة أقل من 60 كلم/سا",
      ],
      answer: 1,
      explanation:
        "القاعدة الشائعة هي الحفاظ على مسافة زمنية لا تقل عن ثانيتين خلف المركبة الأمامية، وزيادتها في ظروف الرؤية الضعيفة أو الطرق المبللة.",
    },
  },
  {
    id: "q19",
    sign: { type: "danger" },
    en: {
      question:
        "A red-bordered triangular sign with an exclamation mark generally warns of:",
      options: [
        "A speed camera ahead",
        "A general danger requiring extra caution",
        "A rest area ahead",
        "A toll station ahead",
      ],
      answer: 1,
      explanation:
        'A triangular sign with "!" is a general danger warning sign, alerting drivers to an unspecified hazard ahead.',
    },
    ar: {
      question:
        "العلامة المثلثة ذات الحافة الحمراء وعلامة التعجب تحذر بشكل عام من:",
      options: [
        "رادار للسرعة أمامك",
        "خطر عام يستوجب زيادة الحذر",
        "منطقة استراحة أمامك",
        "محطة أداء رسوم أمامك",
      ],
      answer: 1,
      explanation:
        'العلامة المثلثة بعلامة "!" هي علامة تحذير عام من خطر غير محدد أمامك.',
    },
  },
  {
    id: "q20",
    en: {
      question:
        "When your headlights' high beams (feux de route) are on and another car approaches, you should:",
      options: [
        "Keep high beams on so they see you",
        "Switch to low beams (feux de croisement) to avoid dazzling them",
        "Turn off all lights",
        "Flash repeatedly until they pass",
      ],
      answer: 1,
      explanation:
        "You must switch to low beams when facing oncoming traffic to avoid blinding the other driver.",
    },
    ar: {
      question:
        "عندما تكون الأضواء العالية لسيارتك مشغلة وتقترب مركبة أخرى، يجب عليك:",
      options: [
        "إبقاء الأضواء العالية مشغلة ليروك",
        "التحويل إلى الأضواء المنخفضة لتفادي إبهار السائق الآخر",
        "إطفاء جميع الأضواء",
        "وميض الأضواء بشكل متكرر حتى تمر",
      ],
      answer: 1,
      explanation:
        "يجب التحويل إلى الأضواء المنخفضة عند مواجهة مركبات قادمة في الاتجاه المعاكس لتفادي إبهار سائقها.",
    },
  },
  {
    id: "q21",
    sign: { type: "oneWay" },
    en: {
      question: "This blue rectangular sign with a white arrow indicates:",
      options: [
        "A one-way street in the direction of the arrow",
        "A recommended detour",
        "A parking direction",
        "A dead-end street",
      ],
      answer: 0,
      explanation:
        "This sign indicates a one-way street: traffic may only travel in the direction shown by the arrow.",
    },
    ar: {
      question: "هذه العلامة المستطيلة الزرقاء بسهم أبيض تشير إلى:",
      options: [
        "طريق ذو اتجاه واحد في اتجاه السهم",
        "تحويلة موصى بها",
        "اتجاه للوقوف",
        "طريق مسدود",
      ],
      answer: 0,
      explanation:
        "هذه العلامة تشير إلى طريق ذي اتجاه واحد: يُسمح بالسير فقط في الاتجاه الذي يشير إليه السهم.",
    },
  },
  {
    id: "q22",
    en: {
      question: "What should you do if your vehicle breaks down on a highway?",
      options: [
        "Leave it in the lane and walk for help",
        "Turn on hazard lights, move to the shoulder if possible, place a warning triangle, and stand behind the guardrail",
        "Wait inside the car in your lane with hazards off",
        "Reverse to the nearest exit",
      ],
      answer: 1,
      explanation:
        "You should activate hazard lights, pull onto the shoulder, place a warning triangle behind the vehicle, and take shelter behind the guardrail away from traffic.",
    },
    ar: {
      question: "ماذا يجب عليك أن تفعل إذا تعطلت سيارتك على الطريق السيار؟",
      options: [
        "تركها في المسار والذهاب سيرًا على الأقدام لطلب المساعدة",
        "تشغيل أضواء الخطر، والانتقال إلى الكتف الطرقي إن أمكن، ووضع مثلث التحذير، والوقوف خلف الحاجز الواقي",
        "الانتظار داخل السيارة في مسارها دون تشغيل أضواء الخطر",
        "الرجوع إلى أقرب مخرج بالتراجع",
      ],
      answer: 1,
      explanation:
        "يجب تشغيل أضواء الخطر، والانتقال إلى الكتف الطرقي، ووضع مثلث التحذير خلف السيارة، والاحتماء خلف الحاجز الواقي بعيدًا عن حركة المرور.",
    },
  },
  {
    id: "q23",
    en: {
      question: "On a road with double solid lines in the middle, you should:",
      options: [
        "Overtake only if visibility is good",
        "Never cross the lines to overtake",
        "Cross freely if no oncoming traffic is visible",
        "Cross only at night",
      ],
      answer: 1,
      explanation:
        "Double solid center lines mean overtaking and crossing are strictly prohibited, regardless of visibility.",
    },
    ar: {
      question: "على طريق يتوسطه خطان متصلان مزدوجان، يجب عليك:",
      options: [
        "التجاوز فقط إذا كانت الرؤية جيدة",
        "عدم عبور الخطين للتجاوز مطلقًا",
        "العبور بحرية إذا لم تكن هناك حركة مرور معاكسة ظاهرة",
        "العبور ليلاً فقط",
      ],
      answer: 1,
      explanation:
        "الخطان المتصلان المزدوجان يعنيان منع التجاوز والعبور منعًا باتًا، بغض النظر عن ظروف الرؤية.",
    },
  },
  {
    id: "q24",
    en: {
      question:
        'What is the purpose of the "priorité à droite" (priority to the right) rule in Morocco?',
      options: [
        "It only applies on highways",
        "It gives right of way to vehicles coming from the right at unmarked intersections",
        "It only applies to pedestrians",
        "It gives right of way to the fastest vehicle",
      ],
      answer: 1,
      explanation:
        "This fundamental rule assigns right of way to vehicles arriving from the right at intersections without signs or lights.",
    },
    ar: {
      question: 'ما هو الغرض من قاعدة "الأولوية لليمين" في المغرب؟',
      options: [
        "تنطبق فقط على الطرق السيارة",
        "تمنح أولوية المرور للمركبات القادمة من اليمين عند التقاطعات غير المؤشر عليها",
        "تنطبق فقط على المشاة",
        "تمنح الأولوية للمركبة الأسرع",
      ],
      answer: 1,
      explanation:
        "هذه القاعدة الأساسية تمنح أولوية المرور للمركبات القادمة من اليمين عند التقاطعات الخالية من العلامات أو الإشارات الضوئية.",
    },
  },
  {
    id: "q25",
    en: {
      question:
        'Morocco introduced a driving license points system ("permis à points"). What happens when a driver loses all their points?',
      options: [
        "Nothing, it is only symbolic",
        "The driver's license is invalidated and they must retake steps to recover it",
        "Only a small fine applies",
        "Points reset automatically every month",
      ],
      answer: 1,
      explanation:
        "Under the points-based license system, losing all points results in the license becoming invalid, requiring the driver to follow a recovery procedure.",
    },
    ar: {
      question:
        "أدخل المغرب نظام رخصة السياقة بالنقط. ماذا يحدث عندما يفقد السائق كل نقطه؟",
      options: [
        "لا شيء، الأمر رمزي فقط",
        "تصبح رخصة السياقة ملغاة ويجب على السائق اتباع مسطرة لاسترجاعها",
        "تُطبَّق غرامة بسيطة فقط",
        "تتجدد النقط تلقائيًا كل شهر",
      ],
      answer: 1,
      explanation:
        "في نظام رخصة السياقة بالنقط، فقدان جميع النقط يؤدي إلى إلغاء صلاحية الرخصة، مما يستوجب اتباع مسطرة لاسترجاعها.",
    },
  },
  {
    id: "q26",
    en: {
      question:
        "When must you use your hazard warning lights (feux de détresse)?",
      options: [
        "Whenever it rains lightly",
        "To signal a stopped vehicle, a sudden hazard, or being towed",
        "While parked legally at the curb",
        "Whenever driving at night",
      ],
      answer: 1,
      explanation:
        "Hazard lights warn other drivers of a stationary vehicle, an unexpected obstacle, or a slow-moving/towed vehicle — not for routine driving.",
    },
    ar: {
      question: "متى يجب عليك استعمال أضواء الخطر؟",
      options: [
        "كلما هطل مطر خفيف",
        "للإشارة إلى مركبة متوقفة، أو خطر مفاجئ، أو أثناء الجر",
        "أثناء الوقوف القانوني على الرصيف",
        "كلما قدت ليلاً",
      ],
      answer: 1,
      explanation:
        "أضواء الخطر تُستعمل لتنبيه السائقين الآخرين لوجود مركبة متوقفة أو خطر مفاجئ أو مركبة بطيئة/مجرورة — وليس أثناء القيادة العادية.",
    },
  },
  {
    id: "q27",
    en: {
      question: "Overtaking another vehicle on the right side is generally:",
      options: [
        "Allowed if you are in a hurry",
        "Prohibited, except in specific situations like multi-lane traffic queues",
        "Always allowed on highways",
        "Only allowed for motorcycles",
      ],
      answer: 1,
      explanation:
        "Overtaking on the right is prohibited as a general rule; it is only tolerated in specific cases such as queued multi-lane traffic moving at similar speed.",
    },
    ar: {
      question: "تجاوز مركبة أخرى من الجهة اليمنى يُعتبر بشكل عام:",
      options: [
        "مسموحًا إذا كنت مستعجلاً",
        "ممنوعًا، إلا في حالات خاصة كازدحام السير في عدة مسارات",
        "مسموحًا دائمًا على الطرق السيارة",
        "مسموحًا فقط للدراجات النارية",
      ],
      answer: 1,
      explanation:
        "التجاوز من اليمين ممنوع كقاعدة عامة، ولا يُتسامح به إلا في حالات خاصة كازدحام السير في عدة مسارات بسرعة متقاربة.",
    },
  },
  {
    id: "q28",
    en: {
      question: "In case of dense fog, you should:",
      options: [
        "Use high beams for better visibility",
        "Use low beams and/or fog lights, and reduce speed significantly",
        "Drive at normal speed but honk frequently",
        "Turn off all lights to avoid glare",
      ],
      answer: 1,
      explanation:
        "In fog, high beams reflect off the fog and reduce visibility further; low beams or fog lights should be used along with a significant reduction in speed.",
    },
    ar: {
      question: "في حالة الضباب الكثيف، يجب عليك:",
      options: [
        "استعمال الأضواء العالية لرؤية أفضل",
        "استعمال الأضواء المنخفضة و/أو أضواء الضباب، وتخفيف السرعة بشكل كبير",
        "القيادة بسرعة عادية مع استعمال البوق باستمرار",
        "إطفاء جميع الأضواء لتفادي الانعكاس",
      ],
      answer: 1,
      explanation:
        "في الضباب، تنعكس الأضواء العالية على الضباب وتقلل الرؤية أكثر؛ يجب استعمال الأضواء المنخفضة أو أضواء الضباب مع تخفيف كبير للسرعة.",
    },
  },
  {
    id: "q29",
    en: {
      question:
        "What safety equipment must be carried in a private vehicle in Morocco?",
      options: [
        "Nothing is mandatory",
        "At minimum, a warning triangle (and a high-visibility vest is strongly recommended)",
        "A fire extinguisher only",
        "A spare set of number plates",
      ],
      answer: 1,
      explanation:
        "Drivers should carry a warning triangle at minimum; a high-visibility safety vest is also strongly recommended for use during breakdowns or accidents.",
    },
    ar: {
      question: "ما هي معدات السلامة الواجب توفرها في مركبة خاصة بالمغرب؟",
      options: [
        "لا شيء إجباري",
        "مثلث التحذير على الأقل (وتوصى بشدة سترة السلامة العاكسة)",
        "مطفأة حريق فقط",
        "لوحة ترقيم احتياطية",
      ],
      answer: 1,
      explanation:
        "يجب أن يتوفر السائق على مثلث التحذير على الأقل، كما يوصى بشدة بسترة السلامة العاكسة لاستعمالها أثناء الأعطال أو الحوادث.",
    },
  },
  {
    id: "q30",
    en: {
      question:
        "When a public bus signals to leave a bus stop in an urban area, other drivers should generally:",
      options: [
        "Speed past it before it pulls out",
        "Facilitate its departure by slowing down or letting it merge, where safe to do so",
        "Ignore the signal completely",
        "Overtake it from the right immediately",
      ],
      answer: 1,
      explanation:
        "Common traffic courtesy and many local regulations encourage giving way to buses signaling to re-enter traffic from a stop, where it is safe to do so.",
    },
    ar: {
      question:
        "عندما تشير حافلة عمومية برغبتها في مغادرة محطة التوقف داخل المدينة، يجب على السائقين الآخرين بشكل عام:",
      options: [
        "تجاوزها بسرعة قبل أن تخرج",
        "تسهيل خروجها بالتباطؤ أو تركها تندمج في السير، متى كان ذلك آمنًا",
        "تجاهل الإشارة كليًا",
        "تجاوزها من اليمين فورًا",
      ],
      answer: 1,
      explanation:
        "تشجع آداب السير وبعض الأنظمة المحلية على إفساح الطريق للحافلات التي تشير برغبتها في العودة إلى السير من المحطة، متى كان ذلك آمنًا.",
    },
  },
];
