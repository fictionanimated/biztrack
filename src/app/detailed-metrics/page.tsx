
"use client";

import { useState, useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { format, subDays, differenceInDays } from 'date-fns';
import type { DateRange } from "react-day-picker";
import { DateFilter } from "@/components/dashboard/date-filter";
import { FinancialMetrics } from "@/components/detailed-metrics/financial-metrics";
import { ClientMetrics } from "@/components/detailed-metrics/client-metrics";
import { GrowthMetrics } from "@/components/detailed-metrics/growth-metrics";
import { SalesMetrics } from "@/components/detailed-metrics/sales-metrics";
import { MarketingMetrics } from "@/components/detailed-metrics/marketing-metrics";
import { ProjectMetrics } from "@/components/detailed-metrics/project-metrics";
import { OrderMetrics } from "@/components/detailed-metrics/order-metrics";
import { IncomeSourceFilter } from "@/components/detailed-metrics/income-source-filter";
import type { IncomeSource } from "@/lib/data/incomes-data";

export default function DetailedMetricsPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [incomeSources, setIncomeSources] = useState<string[]>([]);
    const [selectedSources, setSelectedSources] = useState<string[]>([]);

    useEffect(() => {
        const fromParam = searchParams.get('from');
        const toParam = searchParams.get('to');
        if (fromParam && toParam) {
            const from = new Date(fromParam.replace(/-/g, '/'));
            const to = new Date(toParam.replace(/-/g, '/'));
            if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
                setDate({ from, to });
            }
        } else {
             const today = new Date();
             const from = new Date(today.getFullYear(), today.getMonth(), 1);
             setDate({ from, to: today });
        }
        
        const sourcesParam = searchParams.get('sources');
        if (sourcesParam) {
            setSelectedSources(sourcesParam.split(','));
        } else {
            setSelectedSources([]);
        }

    }, [searchParams]);

    useEffect(() => {
        async function fetchSources() {
            try {
                const res = await fetch('/api/incomes');
                if (!res.ok) throw new Error('Failed to fetch income sources');
                const data: IncomeSource[] = await res.json();
                setIncomeSources(data.map(s => s.name));
            } catch (e) {
                console.error("Error fetching income sources:", e);
            }
        }
        fetchSources();
    }, []);

    const createQueryString = useCallback(
        (paramsToUpdate: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString());
            for (const [name, value] of Object.entries(paramsToUpdate)) {
                if (value && value.length > 0) {
                    params.set(name, value);
                } else {
                    params.delete(name);
                }
            }
            return params.toString();
        },
        [searchParams]
    );
    
    const updateUrl = (newDate: DateRange | undefined, newSources: string[]) => {
        router.push(`${pathname}?${createQueryString({
            from: newDate?.from ? format(newDate.from, 'yyyy-MM-dd') : null,
            to: newDate?.to ? format(newDate.to, 'yyyy-MM-dd') : null,
            sources: newSources.join(','),
        })}`, { scroll: false });
    };

    const handleSetDate = (newDate: DateRange | undefined) => {
        setDate(newDate);
        updateUrl(newDate, selectedSources);
    };
    
    const handleSetSources = (newSources: string[]) => {
        setSelectedSources(newSources);
        updateUrl(date, newSources);
    }

    const previousPeriodLabel = (() => {
        if (!date?.from || !date?.to) return "previous period";
        const from = date.from;
        const to = date.to;
        const duration = differenceInDays(to, from);
        const prevTo = subDays(from, 1);
        const prevFrom = subDays(prevTo, duration);
        return `from ${format(prevFrom, 'MMM d')} - ${format(prevTo, 'MMM d, yyyy')}`;
    })();


    return (
        <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="font-headline text-lg font-semibold md:text-2xl">
                    Detailed Metrics
                </h1>
                <div className="ml-auto flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                    <IncomeSourceFilter
                        availableSources={incomeSources}
                        selectedSources={selectedSources}
                        setSelectedSources={handleSetSources}
                    />
                    <DateFilter date={date} setDate={handleSetDate} />
                </div>
            </div>

            <div className="space-y-6">
                <FinancialMetrics previousPeriodLabel={previousPeriodLabel} />
                <OrderMetrics />
                <ClientMetrics />
                <GrowthMetrics previousPeriodLabel={previousPeriodLabel} />
                <SalesMetrics />
                <MarketingMetrics />
                <ProjectMetrics />
            </div>
        </main>
    );
}
