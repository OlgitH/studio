import BackHomeLink from '../../components/BackHomeLink';
import JobBarChart from './JobBarChart';
import JobFrictionScatter from './JobFrictionScatter';

// Force Next.js to revalidate this page on every request or at a specific interval
export const revalidate = 3600; // Revalidate every hour

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


async function getJobData() {
  // Use the FULL URL. This works on both local dev and GitHub Actions.
  const URL = "https://olgith.github.io/job-insights/public/job_data.json";

  try {
    const res = await fetch(URL, { cache: 'no-store' });
    if (!res.ok) return [];
    // The JSON source may contain bare `NaN` (invalid JSON) — replace before parsing.
    const text = await res.text();
    const sanitised = text.replace(/:\s*NaN/g, ': null');
    return JSON.parse(sanitised) as JobRow[];
  } catch {
    console.error("Could not fetch data from GitHub Pages");
    return [];
  }
}

export default async function JobReportPage() {
  const data = await getJobData();
  return (
    <>
      <BackHomeLink />
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Bristol Job Market Analysis</h1>

        {/* 1. D3 bar chart — vacancies per sector, colour-coded by friction */}
        <h2 className='font-bold mb-6'>Are jobs like UX/UI really in demand?</h2>
        <p className='mb-10 font-light'>We are told there is a skills shortage but are employers actually struggling to fill these roles? If they were would they not be offering jobs to people quicker? The frustration of people who have taken bootcamps and courses only to find they cannot be hired is clear.</p>
        <JobBarChart data={data} />
        <p className='mb-10 font-light'>It appears that design and construction roles are taking notably longer than other sectors to fill roles.</p>
        <p className='mb-10 font-light'>It appears that green jobs are in high demand and are quickly filled, but there are not many green jobs on offer.</p>


        <JobFrictionScatter data={data} />

        {/* 2. Create a Dynamic Table from the JSON */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-white ">
            <thead>
              <tr className="font-normal">
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Vacancies</th>
                <th className="p-3 border">Avg. Days (Friction)</th>
              </tr>
            </thead>
            <tbody className="font-normal">
              {data.map((row, index) => (
                <tr key={`${row.category}-${index}`} className="text-center">
                  <td className="p-3 border font-semibold">{row.category}</td>
                  <td className="p-3 border">{row.vacancies}</td>
                  <td className="p-3 border">{row.friction.toFixed(1)}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}