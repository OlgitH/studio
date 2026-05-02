'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';

type JobRow = {
  category: string;
  vacancies: number;
  friction: number;
};

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
      .scalePoint<string>()
      .domain(titles)
      .range([margin.left, width - margin.right])
      .padding(0.55);

    const y = d3
      .scaleLinear()
      .domain([0, maxFriction * 1.12])
      .nice()
      .range([height - margin.bottom, margin.top]);

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

    const plot = svg.append('g');

    plot
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .call((g) => {
        g.selectAll('text')
          .attr('fill', '#f2f2f2')
          .style('font-size', '11px')
          .attr('text-anchor', 'end')
          .attr('transform', 'rotate(-38)')
          .attr('dx', '-0.6em')
          .attr('dy', '0.15em');

        g.selectAll('line, path').attr('stroke', '#4a4a4a');
      });

    plot
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(8).tickSizeOuter(0))
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
      .data(y.ticks(8))
      .join('line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', (d) => y(d))
      .attr('y2', (d) => y(d));

    plot
      .append('text')
      .attr('x', width / 2)
      .attr('y', height - 18)
      .attr('fill', '#f2f2f2')
      .attr('text-anchor', 'middle')
      .style('font-size', '13px')
      .text('Job title');

    plot
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 18)
      .attr('fill', '#f2f2f2')
      .attr('text-anchor', 'middle')
      .style('font-size', '13px')
      .text('Avg. days (friction)');

    const dots = plot
      .append('g')
      .selectAll('circle')
      .data(plotData, (d) => (d as PlotDatum).id)
      .join('circle')
      .attr('cx', width / 2)
      .attr('cy', height - margin.bottom + 24)
      .attr('r', 0)
      .attr('fill', (d) => color(d.vacancies))
      .attr('fill-opacity', 0.88)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.2);

    dots.append('title').text(
      (d) => `${d.title}\nFriction: ${d.friction.toFixed(1)} days\nVacancies: ${d.vacancies}`,
    );

    dots
      .transition()
      .delay((_, i) => i * 34)
      .duration(900)
      .ease(d3.easeCubicOut)
      .attr('cx', (d) => (x(d.title) ?? margin.left) + d.slotOffset)
      .attr('cy', (d) => y(d.friction))
      .attr('r', (d) => radius(d.vacancies));
  }, [plotData]);

  return (
    <section className="mb-12 rounded-lg border border-zinc-700 bg-[#171111] p-4 shadow-lg md:p-6">
      <h2 className="mb-4 text-xl font-semibold">Friction by job title (scatter)</h2>
      <p className="mb-5 text-sm text-zinc-300">
        X-axis uses unique job titles, while up to two roles per title are plotted as separate dots.
      </p>
      <svg
        ref={svgRef}
        className="h-auto w-full"
        role="img"
        aria-label="Scatter chart showing job title vs average days friction"
      />
    </section>
  );
}