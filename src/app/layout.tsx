import type { Metadata } from 'next';
import './globals.css';
import { PortalShell } from '@/components/PortalShell';

export const metadata: Metadata = { title: 'Portal de Candidaturas | BDP', description: 'Encuentra oportunidades para aportar al desarrollo productivo de Bolivia.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es-BO"><body><PortalShell>{children}</PortalShell></body></html>; }
