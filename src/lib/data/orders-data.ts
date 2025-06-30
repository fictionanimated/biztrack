
export interface Order {
    id: string;
    clientUsername: string;
    date: string;
    amount: number;
    source: string;
    gig?: string;
    status: 'Completed' | 'In Progress' | 'Cancelled';
    rating?: number;
    cancellationReasons?: string[];
}

export const initialOrders: Order[] = [
    { id: 'ORD001', clientUsername: 'olivia.m', date: '2024-05-20', amount: 1999.00, source: 'Web Design', gig: 'Acme Corp Redesign', status: 'Completed', rating: 5 },
    { id: 'ORD002', clientUsername: 'jackson.l', date: '2024-05-21', amount: 399.00, source: 'Consulting', gig: 'Q1 Strategy Session', status: 'Completed', rating: 4.2 },
    { id: 'ORD003', clientUsername: 'isabella.n', date: '2024-05-22', amount: 299.00, source: 'Logo Design', gig: "Brand Identity for 'Innovate'", status: 'Cancelled', cancellationReasons: ["Not satisfied with design"] },
    { id: 'ORD004', clientUsername: 'will.k', date: '2024-05-23', amount: 999.00, source: 'Web Design', gig: 'Startup Landing Page', status: 'In Progress' },
    { id: 'ORD005', clientUsername: 'sofia.d', date: '2024-05-24', amount: 499.00, source: 'SEO Services', gig: 'Monthly SEO Retainer', status: 'Completed', rating: 3.7 },
    { id: 'ORD006', clientUsername: 'olivia.m', date: '2024-04-15', amount: 2500.00, source: 'Web Design', gig: 'E-commerce Platform', status: 'Completed', rating: 4.8 },
    { id: 'ORD007', clientUsername: 'isabella.n', date: '2024-03-18', amount: 500.00, source: 'Logo Design', gig: 'Branding Refresh', status: 'Completed', rating: 5 },
];
