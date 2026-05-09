'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { JobRow } from './jobDataUtils';

const STAGGER_MS = 120; // delay between each dot
const DOT_DURATION_MS = 600;

type PlotDatum = {
  id: string;
  title: string;
  friction: number;
  vacancies: number;
  slotOffset: number;
};

type JobFrictionScatterProps = {
  data: JobRow[];
};

export default function JobFrictionScatter({ data }: JobFrictionScatterProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isMobileFullscreen, setIsMobileFullscreen] = useState(false);
  // Holds a function that resets + replays the scatter animation
  const animateRef = useRef<(() => void) | null>(null);
  // Tracks whether the section was visible on the last observation tick
  const wasVisibleRef = useRef(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isMobileFullscreen) {
        setIsMobileFullscreen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileFullscreen]);

  // Lock page scroll while the mobile fullscreen chart is open.
  useEffect(() => {
    if (!isMobileFullscreen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileFullscreen]);

  const plotData = useMemo(() => {
    const grouped = d3.group(data, (d) => d.category);
    const result: PlotDatum[] = [];

    for (const [title, rows] of grouped) {
      const kept = rows.slice(0, 2);
      const hasPair = kept.length === 2;

      kept.forEach((row, index) => {
        result.push({
          id: `${title}-${index}-${row.friction}-${row.vacancies}`,
          title,
          friction: row.friction,
          vacancies: row.vacancies,
          slotOffset: hasPair ? (index === 0 ? -10 : 10) : 0,
        });
      });
    }

    return result;
  }, [data]);

  useEffect(() => {
    if (!svgRef.current || plotData.length === 0) {
      return;
    }

    const width = 1100;
    const height = 560;
    const margin = { top: 28, right: 24, bottom: 150, left: 74 };

    const titles = Array.from(new Set(plotData.map((d) => d.title)));
    const maxFriction = d3.max(plotData, (d) => d.friction) ?? 0;
    const maxVacancies = d3.max(plotData, (d) => d.vacancies) ?? 1;

    const x = d3
      .scaleLinear()
      .domain([0, maxFriction * 1.12])
      .nice()
      .range([margin.left, width - margin.right]);

    const y = d3
      .scalePoint<string>()
      .domain(titles)
      .range([height - margin.bottom, margin.top])
      .padding(0.55);

    const radius = d3
      .scaleSqrt()
      .domain([0, maxVacancies])
      .range([4, 14]);

    const color = d3
      .scaleSequential(d3.interpolateLab('#7dc3ff', '#ff7f50'))
      .domain([0, maxVacancies]);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // Clip dots to the chart canvas so they're invisible during the fling
    svg.append('defs')
      .append('clipPath')
      .attr('id', 'scatter-clip')
      .append('rect')
      .attr('x', margin.left)
      .attr('y', margin.top)
      .attr('width', width - margin.left - margin.right)
      .attr('height', height - margin.top - margin.bottom);

    const plot = svg.append('g');

    // Highlight high-friction zone (100+ days) with a subtle near-black tint.
    if (x.domain()[1] > 100) {
      plot
        .append('rect')
        .attr('x', x(100))
        .attr('y', margin.top)
        .attr('width', width - margin.right - x(100))
        .attr('height', height - margin.top - margin.bottom)
        .attr('fill', '#ffffff')
        .attr('fill-opacity', 0.08);
    }

    plot
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(8).tickSizeOuter(0))
      .call((g) => {
        g.selectAll('text')
          .attr('fill', '#f2f2f2')
          .style('font-size', '11px');

        g.selectAll('line, path').attr('stroke', '#4a4a4a');
      });

    plot
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSizeOuter(0))
      .call((g) => {
        g.selectAll('text').attr('fill', '#f2f2f2').style('font-size', '12px');
        g.selectAll('line').attr('stroke', '#4a4a4a');
        g.selectAll('path').attr('stroke', '#4a4a4a');
      });

    plot
      .append('g')
      .attr('stroke', '#303030')
      .attr('stroke-dasharray', '4 5')
      .selectAll('line')
      .data(x.ticks(8))
      .join('line')
      .attr('x1', (d) => x(d))
      .attr('x2', (d) => x(d))
      .attr('y1', margin.top)
      .attr('y2', height - margin.bottom);

    plot
      .append('text')
      .attr('x', width / 2)
      .attr('y', height - 18)
      .attr('fill', '#f2f2f2')
      .attr('text-anchor', 'middle')
      .style('font-size', '13px')
      .text('Avg. days (friction)');

    plot
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 18)
      .attr('fill', '#f2f2f2')
      .attr('text-anchor', 'middle')
      .style('font-size', '13px');

    // Sort by vacancies descending — largest dots flung first
    const sortedData = [...plotData].sort((a, b) => b.vacancies - a.vacancies);

    // Brush launch origin — top-left corner of plot area (off-canvas before clip)
    const originX = margin.left;
    const originY = margin.top - 80;

    const dotLayer = plot
      .append('g')
      .attr('clip-path', 'url(#scatter-clip)')
      .attr('class', 'dot-layer');

    const dots = dotLayer
      .selectAll('circle')
      .data(sortedData, (d) => (d as PlotDatum).id)
      .join('circle')
      .attr('cx', originX)
      .attr('cy', originY)
      .attr('r', (d) => radius(d.vacancies))
      .attr('fill', (d) => color(d.vacancies))
      .attr('fill-opacity', 0.88)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.2);

    const hoverLabel = plot
      .append('text')
      .attr('fill', '#ffffff')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('paint-order', 'stroke')
      .style('stroke', '#000000')
      .style('stroke-width', '3px')
      .style('stroke-linejoin', 'round')
      .style('pointer-events', 'none')
      .attr('text-anchor', 'middle')
      .attr('opacity', 0);

    dots
      .on('mouseenter', function (event, d) {
        const dot = d3.select(this);
        const cx = Number(dot.attr('cx'));
        const cy = Number(dot.attr('cy'));

        dot.raise()
          .interrupt('hover')
          .transition('hover')
          .duration(140)
          .attr('r', radius(d.vacancies) * 1.16)
          .attr('stroke-width', 1.8)
          .attr('fill-opacity', 1);

        hoverLabel
          .interrupt('hover')
          .text(d.title)
          .attr('x', cx)
          .attr('y', cy - radius(d.vacancies) * 1.35)
          .transition('hover')
          .duration(120)
          .attr('opacity', 1);
      })
      .on('mousemove', function (event) {
        const dot = d3.select(this);
        const cx = Number(dot.attr('cx'));
        const cy = Number(dot.attr('cy'));

        hoverLabel
          .attr('x', cx)
          .attr('y', cy - Number(dot.attr('r')) - 8);
      })
      .on('mouseleave', function (event, d) {
        const dot = d3.select(this);

        dot.interrupt('hover')
          .transition('hover')
          .duration(140)
          .attr('r', radius(d.vacancies))
          .attr('stroke-width', 1.2)
          .attr('fill-opacity', 0.88);

        hoverLabel
          .interrupt('hover')
          .transition('hover')
          .duration(100)
          .attr('opacity', 0);
      });

    // Expose the animation so IntersectionObserver can re-trigger it
    animateRef.current = () => {
      dots
        .interrupt()
        .attr('cx', originX)
        .attr('cy', originY)
        .transition()
        .delay((_, i) => i * STAGGER_MS)
        .duration(DOT_DURATION_MS)
        .ease(d3.easeBackOut.overshoot(1.6))
        .attr('cx', (d) => x(d.friction))
        .attr('cy', (d) => (y(d.title) ?? margin.top) + d.slotOffset);
    };
  }, [plotData]);

  // Run animation on first mount and whenever the section scrolls into view
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
          <h2 className="mb-1 text-xl font-semibold">How long it takes to fill vacancies, by sector</h2>
          <p className="text-sm text-zinc-300">
            Each dot represents a sector, with horizontal position showing average time to fill (friction). Size and color indicate the number of vacancies.
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
          aria-label="Scatter chart showing time to fill vacancies by sector"
        />
      </div>
    </section>
  );
}