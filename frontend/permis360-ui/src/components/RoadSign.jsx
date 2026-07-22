// Renders stylised road signs used across the exam quiz and the driving simulator.
// `type` selects the sign; `value` is used for speed-limit numbers.

const Stop = () => (
  <g>
    <polygon points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30" fill="#C1272D" stroke="#fff" strokeWidth="3" />
    <text x="50" y="62" textAnchor="middle" fontSize="30" fontWeight="700" fill="#fff" fontFamily="Arial">STOP</text>
  </g>
);

const Yield = () => (
  <g>
    <polygon points="50,6 96,92 4,92" fill="#fff" stroke="#C1272D" strokeWidth="9" strokeLinejoin="round" />
  </g>
);

const SpeedLimit = ({ value = 60 }) => (
  <g>
    <circle cx="50" cy="50" r="46" fill="#fff" stroke="#C1272D" strokeWidth="9" />
    <text x="50" y="62" textAnchor="middle" fontSize="30" fontWeight="700" fill="#1C1B17" fontFamily="Arial">{value}</text>
  </g>
);

const EndOfLimit = ({ value = 60 }) => (
  <g>
    <circle cx="50" cy="50" r="46" fill="#fff" stroke="#8a8a8a" strokeWidth="6" />
    <text x="50" y="60" textAnchor="middle" fontSize="26" fontWeight="700" fill="#555" fontFamily="Arial">{value}</text>
    <line x1="16" y1="76" x2="84" y2="24" stroke="#555" strokeWidth="5" />
  </g>
);

const Pedestrian = () => (
  <g>
    <polygon points="50,4 96,92 4,92" fill="#fff" stroke="#C1272D" strokeWidth="9" strokeLinejoin="round" />
    <g transform="translate(50 62)" fill="#1C1B17">
      <circle cx="0" cy="-16" r="7" />
      <path d="M -8 -6 Q 0 2 8 -6 L 10 20 L 3 20 L 0 4 L -3 20 L -10 20 Z" />
    </g>
  </g>
);

const NoEntry = () => (
  <g>
    <circle cx="50" cy="50" r="46" fill="#C1272D" stroke="#fff" strokeWidth="4" />
    <rect x="18" y="42" width="64" height="16" fill="#fff" />
  </g>
);

const PriorityRoad = () => (
  <g>
    <rect x="20" y="20" width="60" height="60" fill="#FFD400" stroke="#1C1B17" strokeWidth="3" transform="rotate(45 50 50)" />
  </g>
);

const Roundabout = () => (
  <g>
    <circle cx="50" cy="50" r="46" fill="#fff" stroke="#1959A8" strokeWidth="9" />
    <g fill="none" stroke="#1959A8" strokeWidth="8">
      <path d="M 30 30 A 22 22 0 1 1 30 70" markerEnd="url(#arrow)" />
    </g>
    <polygon points="26,72 34,70 30,80" fill="#1959A8" />
  </g>
);

const NoParking = () => (
  <g>
    <circle cx="50" cy="50" r="46" fill="#1959A8" stroke="#C1272D" strokeWidth="9" />
    <line x1="18" y1="82" x2="82" y2="18" stroke="#C1272D" strokeWidth="9" />
    <text x="50" y="63" textAnchor="middle" fontSize="40" fontWeight="700" fill="#fff" fontFamily="Arial">P</text>
  </g>
);

const Danger = () => (
  <g>
    <polygon points="50,6 96,92 4,92" fill="#fff" stroke="#C1272D" strokeWidth="9" strokeLinejoin="round" />
    <text x="50" y="74" textAnchor="middle" fontSize="46" fontWeight="700" fill="#1C1B17" fontFamily="Arial">!</text>
  </g>
);

const OneWay = () => (
  <g>
    <rect x="6" y="30" width="88" height="40" fill="#1959A8" />
    <polygon points="60,32 88,50 60,68" fill="#fff" />
    <rect x="18" y="44" width="42" height="12" fill="#fff" />
  </g>
);

const SIGNS = {
  stop: Stop,
  yield: Yield,
  speedLimit: SpeedLimit,
  endOfLimit: EndOfLimit,
  pedestrian: Pedestrian,
  noEntry: NoEntry,
  priorityRoad: PriorityRoad,
  roundabout: Roundabout,
  noParking: NoParking,
  danger: Danger,
  oneWay: OneWay,
};

export const RoadSign = ({ type, value, size = 72, className }) => {
  const Cmp = SIGNS[type] || Danger;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <Cmp value={value} />
    </svg>
  );
};
