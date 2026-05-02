'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const PAGE_SIZE = 20;

type JobListing = {
  title: string;
  company: string;
  salary_min: number;
  salary_max: number;
  days_on_market: number;
};

type JobRow = {
  category: string;
  vacancies: number;
  friction: number;
  target: number;
  jobs: JobListing[];
};

type Props = { data: JobRow[] };

// Helpers defined outside component to avoid recreation on every render
function highlightBar(
  el: SVGRectElement,
  d: JobRow,
  params: { y: d3.ScaleLinear<number, number>; innerH: number },
) {
  const yVal = params.y(d.vacancies);
  d3.select(el)
    .raise()
    .interrupt()
    .transition()
    .duration(150)
    .ease(d3.easeCubicOut)
    .attr('y', yVal - 8)
    .attr('height', params.innerH - yVal + 8)
    .attr('stroke', '#ffffff')
    .attr('stroke-width', 2)
    .attr('opacity', 1);
}

function resetBar(
  el: SVGRectElement,
  d: JobRow,
  params: { y: d3.ScaleLinear<number, number>; innerH: number },
) {
  d3.select(el)
    .interrupt()
    .transition()
    .duration(200)
    .ease(d3.easeCubicOut)
    .attr('y', params.y(d.vacancies))
    .attr('height', params.innerH - params.y(d.vacancies))
    .attr('stroke', 'none')
    .attr('stroke-width', 0)
    .attr('opacity', 0.9);
}

export default function JobBarChart({ data }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const [selectedRow, setSelectedRow] = useState<JobRow | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const chartParamsRef = useRef<{ y: d3.ScaleLinear<number, number>; innerH: number } | null>(null);
  const selectedBarRef = useRef<{ el: SVGRectElement; d: JobRow } | null>(null);
  // Stable ref so D3 event handlers never have a stale closePanel closure
  const closePanelRef = useRef<() => void>(() => {});

  function closePanel() {
    if (selectedBarRef.current && chartParamsRef.current) {
      resetBar(selectedBarRef.current.el, selectedBarRef.current.d, chartParamsRef.current);
      selectedBarRef.current = null;
    }
    setSelectedRow(null);
    setVisibleCount(PAGE_SIZE);
  }

  // Keep the ref current after every render
  useEffect(() => {
    closePanelRef.current = closePanel;
  });

  // Reset visible count when a different sector is selected — deferred to avoid cascading render
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
    if (!selectedRow) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closePanelRef.current();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRow]);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const width = 1100;
    const height = 520;
    const margin = { top: 48, right: 180, bottom: 148, left: 78 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const maxVacancies = d3.max(data, (d) => d.vacancies) ?? 1;
    const frictionMin = d3.min(data, (d) => d.friction) ?? 0;
    const frictionMax = d3.max(data, (d) => d.friction) ?? 1;

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.category))
      .range([0, innerW])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, maxVacancies * 1.15])
      .nice()
      .range([innerH, 0]);

    chartParamsRef.current = { y, innerH };

    const colorScale = d3
      .scaleSequential()
      .domain([frictionMax, frictionMin])
      .interpolator(d3.piecewise(d3.interpolateRgb, ['#f5f0eb', '#ff6b4a', '#e8000d']));

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
      .text('Current vacancies');

    // Bars
    const barG = g.append('g');
    barG
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (d) => x(d.category) ?? 0)
      .attr('width', x.bandwidth())
      .attr('y', innerH)
      .attr('height', 0)
      .attr('fill', (d) => colorScale(d.friction))
      .attr('rx', 3)
      .attr('opacity', 0.9)
      .attr('cursor', 'pointer')
      .on('mouseenter', function (event: MouseEvent, d) {
        const el = event.currentTarget as SVGRectElement;
        if (selectedBarRef.current?.el === el) return;
        const params = chartParamsRef.current;
        if (params) highlightBar(el, d, params);
      })
      .on('mouseleave', function (event: MouseEvent, d) {
        const el = event.currentTarget as SVGRectElement;
        if (selectedBarRef.current?.el === el) return;
        const params = chartParamsRef.current;
        if (params) resetBar(el, d, params);
      })
      .on('click', function (event: MouseEvent, d) {
        const el = event.currentTarget as SVGRectElement;
        const params = chartParamsRef.current;
        if (!params) return;
        // Clicking the same bar closes the panel
        if (selectedBarRef.current?.el === el) {
          closePanelRef.current();
          return;
        }
        // Reset any previously selected bar
        if (selectedBarRef.current) {
          resetBar(selectedBarRef.current.el, selectedBarRef.current.d, params);
        }
        selectedBarRef.current = { el, d };
        highlightBar(el, d, params);
        setSelectedRow(d);
      });

    // Entry animation
    barG
      .selectAll<SVGRectElement, JobRow>('rect')
      .transition()
      .delay((_, i) => i * 55)
      .duration(800)
      .ease(d3.easeCubicOut)
      .attr('y', (d) => y(d.vacancies))
      .attr('height', (d) => innerH - y(d.vacancies));

    // Colour legend — vertical gradient bar on the right
    const legendH = 180;
    const legendX = innerW + 36;
    const legendY = (innerH - legendH) / 2;
    const legendW = 16;
    const gradId = 'friction-grad';

    const defs = svg.append('defs');
    const grad = defs
      .append('linearGradient')
      .attr('id', gradId)
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '0%')
      .attr('y2', '100%');

    const steps = 10;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const frictionVal = frictionMin + t * (frictionMax - frictionMin);
      grad
        .append('stop')
        .attr('offset', `${t * 100}%`)
        .attr('stop-color', colorScale(frictionVal));
    }

    const legend = g.append('g').attr('transform', `translate(${legendX},${legendY})`);

    legend
      .append('rect')
      .attr('width', legendW)
      .attr('height', legendH)
      .attr('rx', 3)
      .attr('fill', `url(#${gradId})`)
      .attr('stroke', '#4a4a4a')
      .attr('stroke-width', 0.5);

    const legendScale = d3
      .scaleLinear()
      .domain([frictionMin, frictionMax])
      .range([0, legendH]);

    const legendAxis = d3
      .axisRight(legendScale)
      .ticks(5)
      .tickFormat((d) => `${d}d`)
      .tickSizeOuter(0);

    legend
      .append('g')
      .attr('transform', `translate(${legendW},0)`)
      .call(legendAxis)
      .call((ax) => {
        ax.selectAll('text').attr('fill', '#f2f2f2').style('font-size', '11px');
        ax.selectAll('line, path').attr('stroke', '#4a4a4a');
      });

    legend
      .append('text')
      .attr('x', legendW / 2)
      .attr('y', -10)
      .attr('fill', '#f2f2f2')
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .text('Friction');
  }, [data]);

  const visibleJobs = selectedRow?.jobs.slice(0, visibleCount) ?? [];
  const hasMore = selectedRow ? visibleCount < selectedRow.jobs.length : false;

  return (
    <section className="mb-12 rounded-lg border border-zinc-700 bg-[#171111] p-4 shadow-lg md:p-6">
      <h2 className="mb-1 text-xl font-semibold">Vacancies by sector</h2>
      <p className="mb-5 text-sm text-zinc-300">
        Bar height = total current vacancies. Colour = avg. days to fill (friction) — red is fast/hot, off-white is
        slow. Click a bar to see active listings.
      </p>
      <svg
        ref={svgRef}
        className="h-auto w-full"
        role="img"
        aria-label="Bar chart showing vacancies per sector, colour-coded by friction"
      />

      {/* Fixed full-height right-side panel */}
      {selectedRow && (
        <aside
          ref={panelRef}
          className="fixed inset-y-0 right-0 z-50 flex w-80 flex-col border-l border-zinc-700 bg-zinc-950 shadow-2xl"
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
