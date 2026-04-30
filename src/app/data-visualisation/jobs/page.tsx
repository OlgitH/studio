import Image from 'next/image';
import BackHomeLink from '../../components/BackHomeLink';

// Force Next.js to revalidate this page on every request or at a specific interval
export const revalidate = 3600; // Revalidate every hour

type JobRow = {
  assigned_category: string;
  vacancies: number;
  friction: number;
};


async function getJobData() {
  // Use the FULL URL. This works on both local dev and GitHub Actions.
  const URL = "https://olgith.github.io/job-insights/public/job_data.json";

  try {
    const res = await fetch(URL, { cache: 'no-store' });
    if (!res.ok) return [];
    return (await res.json()) as JobRow[];
  } catch {
    console.error("Could not fetch data from GitHub Pages");
    return [];
  }
}

export default async function JobReportPage() {
  const data = await getJobData();
  const timestamp = new Date().getTime(); // Cache buster for the image

  return (
    <>
      <BackHomeLink />
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Bristol Job Market Analysis</h1>

        {/* 1. Embed the Generated Image */}
        <div className="mb-12 border rounded-lg overflow-hidden shadow-lg">
          <Image
            src={`https://olgith.github.io/job-insights/public/bristol_cleaned_report.png?t=${timestamp}`}
            alt="Bristol Job Market Report"
            width={1600}
            height={900}
            className="w-full h-auto"
          />
        </div>

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
              {data.map((row) => (
                <tr key={row.assigned_category} className="text-center">
                  <td className="p-3 border font-semibold">{row.assigned_category}</td>
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