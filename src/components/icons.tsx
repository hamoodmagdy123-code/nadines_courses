import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTriangleExclamation,
  faBoxArchive,
  faArrowLeft,
  faArrowRight,
  faAward,
  faChartBar,
  faBookOpen,
  faCheck,
  faCircleCheck,
  faChevronDown,
  faClock,
  faCreditCard,
  faDollarSign,
  faArrowUpRightFromSquare,
  faEye,
  faFileLines,
  faFilter,
  faGlobe,
  faGraduationCap,
  faHeart,
  faCircleInfo,
  faLayerGroup,
  faTableColumns,
  faSpinner,
  faLock,
  faEnvelope,
  faBars,
  faXmark,
  faBox,
  faPhone,
  faPlay,
  faPlus,
  faQuoteLeft,
  faArrowsRotate,
  faFloppyDisk,
  faMagnifyingGlass,
  faBan,
  faPaperPlane,
  faShield,
  faCartShopping,
  faStar,
  faTrashCan,
  faChartLine,
  faUser,
  faUsers,
  faCircleXmark,
  faBolt,
  faRightFromBracket,
  faComment,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons'

export interface IconProps {
  className?: string
  strokeWidth?: number
  size?: number | string
}

function wrap(icon: IconDefinition) {
  const Component = ({ className, size }: IconProps) => (
    <FontAwesomeIcon icon={icon} className={className} style={size ? { fontSize: size } : undefined} />
  )
  Component.displayName = icon.iconName
  return Component
}

export const AlertTriangle = wrap(faTriangleExclamation)
export const Archive = wrap(faBoxArchive)
export const ArrowLeft = wrap(faArrowLeft)
export const ArrowRight = wrap(faArrowRight)
export const Award = wrap(faAward)
export const BarChart3 = wrap(faChartBar)
export const BookOpen = wrap(faBookOpen)
export const Check = wrap(faCheck)
export const CheckCircle = wrap(faCircleCheck)
export const ChevronDown = wrap(faChevronDown)
export const Clock = wrap(faClock)
export const CreditCard = wrap(faCreditCard)
export const DollarSign = wrap(faDollarSign)
export const ExternalLink = wrap(faArrowUpRightFromSquare)
export const Eye = wrap(faEye)
export const FileText = wrap(faFileLines)
export const Filter = wrap(faFilter)
export const Globe = wrap(faGlobe)
export const GraduationCap = wrap(faGraduationCap)
export const Heart = wrap(faHeart)
export const Info = wrap(faCircleInfo)
export const Layers = wrap(faLayerGroup)
export const LayoutDashboard = wrap(faTableColumns)
export const Loader2 = wrap(faSpinner)
export const Lock = wrap(faLock)
export const Mail = wrap(faEnvelope)
export const Menu = wrap(faBars)
export const Package = wrap(faBox)
export const Phone = wrap(faPhone)
export const Play = wrap(faPlay)
export const Plus = wrap(faPlus)
export const Quote = wrap(faQuoteLeft)
export const RefreshCcw = wrap(faArrowsRotate)
export const RotateCcw = wrap(faArrowsRotate)
export const Save = wrap(faFloppyDisk)
export const Search = wrap(faMagnifyingGlass)
export const SearchX = wrap(faBan)
export const Send = wrap(faPaperPlane)
export const Shield = wrap(faShield)
export const ShoppingCart = wrap(faCartShopping)
export const Sparkles = wrap(faStar)
export const Star = wrap(faStar)
export const Trash2 = wrap(faTrashCan)
export const TrendingUp = wrap(faChartLine)
export const User = wrap(faUser)
export const Users = wrap(faUsers)
export const X = wrap(faXmark)
export const XCircle = wrap(faCircleXmark)
export const Zap = wrap(faBolt)
export const LogOut = wrap(faRightFromBracket)
export const MessageCircle = wrap(faComment)
