'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

type JobListing = {
  title: string;
  company: string;
  salary_min: number | null;
  salary_max: number | null;
  days_on_market: number;
};

type JobRow = {
  category: string;
  vacancies: number;
  friction: number;
  target: number;
  jobs: JobListing[];
};

type SalarySeries = {
  category: string;
  avgSalary: number;
};

type Props = { data: JobRow[] };

const PAGE_SIZE = 20;

function formatMoney(value: number | null) {
  if (value == null || !Number.isFinite(value) || value <= 0) return 'Salary not listed';
  return `£${Math.round(value).toLocaleString('en-GB')}`;
}

function formatSalaryRange(min: number | null, max: number | null) {
  if ((min == null || !Number.isFinite(min) || min <= 0) && (max == null || !Number.isFinite(max) || max <= 0)) {
    return 'Salary not listed';
  }
  if (min != null && Number.isFinite(min) && min > 0 && max != null && Number.isFinite(max) && max > 0) {
    if (Math.round(min) === Math.round(max)) return formatMoney(min);
    return `${formatMoney(min)} - ${formatMoney(max)}`;
  }
  return formatMoney((max ?? min) as number);
}

export default function SalaryLineChart({ data }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const [selectedRow, setSelectedRow] = useState<JobRow | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isMobileFullscreen, setIsMobileFullscreen] = useState(false);
  const animateRef = useRef<(() => void) | null>(null);
  const wasVisibleRef = useRef(false);
  const closePanelRef = useRef<() => void>(() => {});

  function closePanel() {
    setSelectedRow(null);
    setVisibleCount(PAGE_SIZE);
  }

  // Keep the ref current after every render
  useEffect(() => {
    closePanelRef.current = closePanel;
  });

  // Reset visible count when a different sector is selected
  useEffect(() => {
    const id = setTimeout(() => setVisibleCount(PAGE_SIZE), 0);
    return () => clearTimeout(id);
  }, [selectedRow?.category]);

  // Scroll outside the panel → close
  useEffect(() => {
    if (!selectedRow) return;
    function handleWheel(e: WheelEvent) {
      if (panelRef.current?.contains(e.target as Node)) return;
      closePanelRef.current();
    }
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [selectedRow]);

  // Escape → close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (selectedRow) closePanelRef.current();
        if (isMobileFullscreen) setIsMobileFullscreen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRow, isMobileFullscreen]);

  // Lock page scroll while the mobile fullscreen chart is open.
  useEffect(() => {
    if (!isMobileFullscreen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileFullscreen]);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const width = 1100;
    const height = 400;
    const margin = { top: 28, right: 24, bottom: 120, left: 78 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const transformedData = data;

    // Calculate average salary per sector
    const salarySeries: SalarySeries[] = transformedData
      .map((row) => {
        const salaries = row.jobs
          .map((job) => {
            const min = job.salary_min;
            const max = job.salary_max;
            const hasMin = min != null && Number.isFinite(min) && min > 0;
            const hasMax = max != null && Number.isFinite(max) && max > 0;
            if (!hasMin && !hasMax) return null;
            if (hasMin && hasMax) return (min + max) / 2;
            return hasMin ? min : max;
          })
          .filter((v): v is number => v != null);

        return {
          category: row.category,
          avgSalary: salaries.length ? d3.mean(salaries) ?? 0 : 0,
        };
      })
      .filter((d) => d.avgSalary > 0);

    if (salarySeries.length === 0) return;

    const xDomain = salarySeries.map((d) => d.category);
    const maxSalary = d3.max(salarySeries, (d) => d.avgSalary) ?? 1;

    const x = d3
      .scalePoint<string>()
      .domain(xDomain)
      .range([0, innerW])
      .padding(0.5);

    const y = d3
      .scaleLinear()
      .domain([0, maxSalary * 1.1])
      .nice()
      .range([innerH, 0]);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Horizontal grid lines
    g.append('g')
      .attr('stroke', '#303030')
      .attr('stroke-dasharray', '4 5')
      .selectAll('line')
      .data(y.ticks(6))
      .join('line')
      .attr('x1', 0)
      .attr('x2', innerW)
      .attr('y1', (d) => y(d))
      .attr('y2', (d) => y(d));

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .call((ax) => {
        ax.selectAll('text')
          .attr('fill', '#f2f2f2')
          .style('font-size', '11px')
          .attr('text-anchor', 'end')
          .attr('transform', 'rotate(-38)')
          .attr('dx', '-0.6em')
          .attr('dy', '0.15em');
        ax.selectAll('line, path').attr('stroke', '#4a4a4a');
      });

    // Y axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(6).tickSizeOuter(0))
      .call((ax) => {
        ax.selectAll('text').attr('fill', '#f2f2f2').style('font-size', '12px');
        ax.selectAll('line, path').attr('stroke', '#4a4a4a');
      });

    // Y axis label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerH / 2)
      .attr('y', -60)
      .attr('fill', '#f2f2f2')
      .attr('text-anchor', 'middle')
      .style('font-size', '13px')
      .text('Average salary');

    // Line
    const line = d3
      .line<SalarySeries>()
      .x((d) => x(d.category) ?? 0)
      .y((d) => y(d.avgSalary))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(salarySeries)
      .attr('fill', 'none')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2.5)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('opacity', 0.9)
      .attr('d', line);

    // Dots with scale animation
    const dots = g
      .append('g')
      .selectAll('circle')
      .data(salarySeries)
      .join('circle')
      .attr('cx', (d) => x(d.category) ?? 0)
      .attr('cy', (d) => y(d.avgSalary))
      .attr('r', 0)
      .attr('fill', '#fff')
      .attr('cursor', 'pointer')
      .on('click', function (event: MouseEvent, d: SalarySeries) {
        event.stopPropagation();
        const matchingRow = data.find((row) => row.category === d.category);
        if (matchingRow) {
          setSelectedRow(matchingRow);
        }
      });

    // Expose animation function for intersection observer
    animateRef.current = () => {
      dots
        .interrupt()
        .attr('r', 0)
        .transition()
        .delay((_, i) => i * 80)
        .duration(1000)
        .ease(d3.easeCubicOut)
        .attr('r', 5);
    };
  }, [data]);

  // IntersectionObserver to trigger animation when section comes into view
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !wasVisibleRef.current) {
            wasVisibleRef.current = true;
            animateRef.current?.();
          } else if (!entry.isIntersecting) {
            wasVisibleRef.current = false;
          }
        });
      },
      { threshold: 0.15 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const visibleJobs = selectedRow?.jobs.slice(0, visibleCount) ?? [];
  const hasMore = selectedRow ? visibleCount < selectedRow.jobs.length : false;

  return (
    <section
      ref={sectionRef}
      className={
        isMobileFullscreen
          ? 'fixed inset-0 z-[70] mb-0 flex h-[100svh] flex-col overflow-hidden bg-[#171111] p-3'
          : 'mb-12 overflow-hidden rounded-lg border border-zinc-700 bg-[#171111] p-4 shadow-lg md:p-6'
      }
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="mb-1 text-xl font-semibold">Salary by sector</h2>
          <p className="text-sm text-zinc-300">
            Average salary across all job listings per sector, calculated from salary ranges. Click a dot to see active listings.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileFullscreen((prev) => !prev)}
          className="shrink-0 rounded border border-zinc-600 px-3 py-1.5 text-xs text-zinc-100 hover:bg-zinc-800 md:hidden"
          aria-label={isMobileFullscreen ? 'Exit fullscreen chart' : 'Expand chart to fullscreen'}
        >
          {isMobileFullscreen ? 'Close' : 'Expand'}
        </button>
      </div>

      {isMobileFullscreen && (
        <p className="mb-2 text-xs text-zinc-400 md:hidden">Rotate your phone to switch between portrait and landscape.</p>
      )}

      <div className={isMobileFullscreen ? 'min-h-0 flex-1' : ''}>
        <svg
          ref={svgRef}
          className={isMobileFullscreen ? 'h-full w-full' : 'h-auto w-full'}
          role="img"
          aria-label="Line chart showing average salary by sector"
        />
      </div>

      {/* Fixed full-height right-side panel */}
      {selectedRow && (
        <aside
          ref={panelRef}
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[100vw] flex-col border-l border-zinc-700 bg-zinc-950 shadow-2xl sm:w-80"
        >
          {/* Header */}
          <div className="flex shrink-0 items-start justify-between border-b border-zinc-800 p-5">
            <div>
              <h3 className="text-base font-semibold">{selectedRow.category}</h3>
              <p className="mt-0.5 text-xs text-zinc-400">
                {selectedRow.vacancies} vacancies &middot; {selectedRow.friction.toFixed(1)}d avg friction
              </p>
            </div>
            <button
              onClick={closePanel}
              className="ml-4 shrink-0 rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              aria-label="Close panel"
            >
              ✕
            </button>
          </div>

          {/* Scrollable job list */}
          <ul className="flex-1 overflow-y-auto p-4">
            {visibleJobs.map((job, i) => (
              <li key={i} className="border-b border-zinc-800 pb-3 pt-1 text-xs">
                <div className="font-medium leading-snug text-zinc-100">{job.title}</div>
                <div className="mt-0.5 text-zinc-400">{job.company}</div>
                <div className="mt-0.5 text-zinc-300">{formatSalaryRange(job.salary_min, job.salary_max)}</div>
                <div className="mt-0.5 text-zinc-500">{job.days_on_market}d on market</div>
              </li>
            ))}
          </ul>

          {/* Load more footer */}
          <div className="shrink-0 border-t border-zinc-800 p-4 text-xs text-zinc-400">
            <span>
              Showing {Math.min(visibleCount, selectedRow.jobs.length)} of {selectedRow.jobs.length}
            </span>
            {hasMore && (
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="mt-2 w-full rounded border border-zinc-700 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                Load next {Math.min(PAGE_SIZE, selectedRow.jobs.length - visibleCount)}
              </button>
            )}
          </div>
        </aside>
      )}
    </section>
  );
}
