import {
  FileCode2, Database, Network, Smartphone, Globe, Code2, Cpu, Shield,
  Server, Layers, GraduationCap, MessageSquare, Github, type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  FileCode2, Database, Network, Smartphone, Globe, Code2, Cpu, Shield,
  Server, Layers, GraduationCap, MessageSquare, Github,
};

export function getIcon(name: string | undefined): LucideIcon {
  return (name && ICONS[name]) || Code2;
}

export const ICON_OPTIONS = [
  'FileCode2', 'Database', 'Network', 'Smartphone', 'Globe', 'Code2',
  'Cpu', 'Shield', 'Server', 'Layers', 'GraduationCap', 'MessageSquare', 'Github',
];
