/**
 * Icon Registry
 *
 * Maps icon string names to Lucide React components.
 * Used to resolve icon references from JSON slide data.
 */
import {
  // Icons used in the Gen AI presentation
  Terminal,
  Brain,
  Layers,
  Code,
  Cpu,
  Share2,
  Network,
  Server,
  MessageSquare,
  Zap,
  AlertTriangle,
  Rocket,
  TrendingUp,
  Activity,
  GitBranch,
  Search,
  CheckCircle,
  BookOpen,
  Database,
  Lock,
  Users,
  Shield,
  File,
  Filter,

  // Navigation and UI icons
  Play,
  Pause,
  Settings,
  Home,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  Globe,
  Calendar,
  Star,
  Heart,
  Eye,
  Download,
  Upload,
  Trash,
  Edit,
  Copy,
  Check,
  Info,
  HelpCircle,
  AlertCircle,
  Plus,
  Minus,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,

  // Common utility icons
  Sparkles,
  Lightbulb,
  Wrench,
  Cog,
  Package,
  Box,
  Folder,
  FolderOpen,
  FileText,
  FileCode,
  Bug,
  Hash,
  Key,
  Cloud,
  Workflow,
  Bot,
  Wand2,
  Palette,
  Pencil,
  Type,
  List,
  Table,
  LayoutGrid,
  LayoutDashboard,
  Maximize,
  Minimize,
  Map,
  MapPin,
  Flag,
  Bookmark,
  Tag,
  Award,
  Trophy,
  Presentation
} from 'lucide-react';

/**
 * Icon name to component mapping
 * @type {Object<string, import('react').ComponentType>}
 */
export const iconRegistry = {
  // Icons used in the Gen AI presentation
  Terminal,
  Brain,
  Layers,
  Code,
  Cpu,
  Share2,
  Network,
  Server,
  MessageSquare,
  Zap,
  AlertTriangle,
  Rocket,
  TrendingUp,
  Activity,
  GitBranch,
  Search,
  CheckCircle,
  BookOpen,
  Database,
  Lock,
  Users,
  Shield,
  File,
  Filter,

  // Navigation and UI icons
  Play,
  Pause,
  Settings,
  Home,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  Globe,
  Calendar,
  Star,
  Heart,
  Eye,
  Download,
  Upload,
  Trash,
  Edit,
  Copy,
  Check,
  Info,
  HelpCircle,
  AlertCircle,
  Plus,
  Minus,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,

  // Common utility icons
  Sparkles,
  Lightbulb,
  Wrench,
  Cog,
  Package,
  Box,
  Folder,
  FolderOpen,
  FileText,
  FileCode,
  Bug,
  Hash,
  Key,
  Cloud,
  Workflow,
  Bot,
  Wand2,
  Palette,
  Pencil,
  Type,
  List,
  Table,
  LayoutGrid,
  LayoutDashboard,
  Maximize,
  Minimize,
  Map,
  MapPin,
  Flag,
  Bookmark,
  Tag,
  Award,
  Trophy,
  Presentation
};

/**
 * Resolves an icon name to its component
 * @param {string | undefined} iconName - Icon name from JSON
 * @returns {import('react').ComponentType | null}
 */
export function resolveIcon(iconName) {
  if (!iconName) return null;
  return iconRegistry[iconName] || null;
}

/**
 * Get all available icon names
 * @returns {string[]}
 */
export function getAvailableIcons() {
  return Object.keys(iconRegistry);
}
