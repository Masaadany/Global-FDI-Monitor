// FDI Monitor Icon System
// Sources: Lucide React (MIT) + Tabler Icons (MIT)
// No paid tiers · Commercial use allowed · No attribution required in UI
// SVG-based · Infinite scalability · Retina-ready

export {
  // Navigation
  Home, Globe, BarChart3, Award, Target, BookOpen, Phone, Menu, X, ChevronDown, ChevronRight,
  // Intelligence
  Zap, Signal, Bell, AlertCircle, AlertTriangle, CheckCircle, Info, Eye, Search,
  // Data
  TrendingUp, TrendingDown, Minus, Activity, PieChart, LineChart, BarChart2, Map,
  // Actions
  Download, Upload, Share2, Copy, Filter, RefreshCw, Settings, Plus, Trash2, Edit,
  // Business
  Building2, Briefcase, Users, UserCheck, DollarSign, CreditCard, ShoppingBag,
  // Geo
  MapPin, Navigation, Compass, Flag,
  // Security
  Lock, Unlock, Shield, ShieldCheck, Key, FileCheck,
  // Files
  FileText, File, Folder, Archive, Printer,
  // Media
  Play, Pause, Volume2, ExternalLink, Link,
  // Status
  Circle, Dot, Loader, Clock, Calendar, ArrowUpRight, ArrowDownRight, ArrowRight,
} from 'lucide-react';

// Icon size presets matching spec
export const ICON_SIZES = {
  xs:  12,
  sm:  16,
  md:  20,
  lg:  24,
  xl:  32,
  '2xl': 48,
} as const;

// Brand-aligned icon colors
export const ICON_COLORS = {
  primary:   '#74BB65',  // green
  navy:      '#0A3D62',  // navy
  grey:      '#696969',  // grey
  light:     '#E2F2DF',  // light bg
  white:     '#FFFFFF',
  up:        '#74BB65',
  down:      '#E57373',
  stable:    '#696969',
  warning:   '#FFB347',
  critical:  '#FF6B4A',
} as const;
