import BackHomeLink from "../components/BackHomeLink";
import PageMain from "../components/PageMain";
import FaqAccordion from "../components/FaqAccordion";
import CtaButton from "../components/CtaButton";
import PageBgImage from "../components/PageBgImage";
import PageContainer from "../components/PageContainer";
import ContentSection from "../components/ContentSection";

const faqs = [
	{
		question: 'What counts as a "business process" here?',
		answer:
			"Anything repetitive that eats up your time without needing your judgement every time — replying to routine enquiries, chasing quotes, logging orders, pulling together reports, or moving information between the tools you already use.",
	},
	{
		question: "Do I need to be technical to use this?",
		answer:
			"No. We handle the setup and explain it in plain terms, then hand over something you or your team can run day to day without needing to understand how it works under the hood.",
	},
	{
		question: "Will this replace staff, or just save them time?",
		answer:
			"It's built to save time, not replace people. The aim is to take the repetitive parts off your plate so you and your team can spend more time on the work that actually needs a human.",
	},
	{
		question: "How do we get started?",
		answer:
			"We start with a short conversation about where your time is going and which tasks feel repetitive or draining. From there we scope a fixed-price project to automate the highest-impact ones first.",
	},
];

const faqSchema = {
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: faqs.map((faq) => ({
		"@type": "Question",
		name: faq.question,
		acceptedAnswer: {
			"@type": "Answer",
			text: faq.answer,
		},
	})),
};

export default function BusinessProcessesPage() {
	return (
		<>
			<BackHomeLink />
			<PageMain
				bgImage={
					<PageBgImage
						src="/bird-blur-3.png"
						width={2000}
						height={1000}
						opacityClassName="opacity-40"
						maxWidthClassName="max-w-4xl"
					/>
				}
			>
				<PageContainer className="z-10">
					<h1 className="text-3xl font-bold mb-4">AI business processes</h1>

					<p className="mb-8 body-text">
						Small businesses lose a lot of hours to admin that doesn&apos;t need
						a human eye every time &mdash; replying to the same enquiries,
						chasing paperwork, updating spreadsheets, writing up reports. We
						help you set up AI and simple automation to take that repetitive
						work off your plate, so you can spend your time on the parts of the
						business that you would rather spend time on.
					</p>

					<section
						className="mb-6 max-w-2xl"
						aria-labelledby="what-we-help-with-heading"
					>
						<h2
							id="what-we-help-with-heading"
							className="text-xl font-semibold mb-2"
						>
							Thoughtful and human-focussed approach
						</h2>
						<p className="mb-8 body-text">
							We want to use AI thoughtfully and with purpose. Ideally, before
							automating or handing some process over to AI we have to analyse
							the conseqcuences, both on the product and the effect it is going
							to have on humans. We should not blindly use AI. That said, it is
							too powerful a tool to not use in some way - but let's not do it
							if it's bad for us. The end product should have a human element so
							a human needs to be involved in the process.
						</p>
					</section>

					<section
						className="mb-6 max-w-2xl"
						aria-labelledby="what-we-help-with-heading"
					>
						<h2
							id="what-we-help-with-heading"
							className="text-xl font-semibold mb-2"
						>
							What we help with
						</h2>
						<ul className="list-disc pl-5 space-y-1 font-light">
							<li>Automating repetitive admin tasks and data entry</li>
							<li>AI-assisted handling of routine customer enquiries</li>
							<li>
								Streamlining reporting, so figures are ready without the chase
							</li>
							<li>
								Connecting up the tools you already use, so information stops
								getting re-typed
							</li>
							<li>
								Simple internal tools built around how your business actually
								works
							</li>
						</ul>
					</section>
				</PageContainer>

				<ContentSection variant="white" width="wide" className="font-light">
					<section className="max-w-2xl" aria-labelledby="faq-heading">
						<h2 id="faq-heading" className="text-xl font-semibold mb-2">
							Frequently asked questions
						</h2>
						<FaqAccordion faqs={faqs} />
					</section>
				</ContentSection>

				<PageContainer className="z-10 pt-8">
					<p className="mb-8 body-text">
						<CtaButton href="/case-studies">Case studies</CtaButton>
					</p>

					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
					/>
				</PageContainer>
			</PageMain>
		</>
	);
}
